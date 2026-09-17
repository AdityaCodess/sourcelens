import hashlib
import os
import shutil
from datetime import datetime, timezone
from typing import List
from fastapi import APIRouter, UploadFile, File, HTTPException, BackgroundTasks, status
from pydantic import BaseModel

from app.models.document import DocumentModel
from app.models.project import Project
from app.extraction.pdf_parser import parse_pdf
from app.extraction.docx_parser import parse_docx
from app.extraction.segmenter import segment_text

router = APIRouter()

# Temporary upload directory for processing
UPLOAD_DIR = "/tmp/sourcelens_uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

class DocumentResponse(BaseModel):
    id: str
    filename: str
    fingerprint: str | None
    status: str
    statistics: dict
    created_at: datetime

async def process_document_background(document_id: str, file_path: str, mime_type: str):
    """
    Background worker to extract text, segment it, and update the database.
    In a full production environment, this would be a Celery task.
    """
    doc = await DocumentModel.get(document_id)
    if not doc:
        return

    try:
        doc.status = "EXTRACTING"
        await doc.save()

        extraction_result = {}
        
        # Route to appropriate parser
        if mime_type == "application/pdf":
            extraction_result = parse_pdf(file_path)
        elif mime_type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
            extraction_result = parse_docx(file_path)
        else:
            raise ValueError(f"Unsupported mime type for extraction: {mime_type}")

        # Perform chunking/segmentation for vectorization later
        passages = segment_text(extraction_result["full_text"])

        # Update document statistics and status
        doc.statistics = extraction_result.get("statistics", {})
        doc.statistics["passage_count"] = len(passages)
        
        # Generate a mock forensic fingerprint (can be tied to MinHash later)
        doc.fingerprint = f"SL-{hashlib.md5(file_path.encode()).hexdigest()[:8].upper()}"
        doc.status = "ANALYZED"
        await doc.save()

        # TODO: Save passages to the database and trigger Vector Embedding (Stage 2)

    except Exception as e:
        doc.status = "FAILED"
        await doc.save()
        print(f"Extraction failed for {document_id}: {str(e)}")
    finally:
        # Clean up local file
        if os.path.exists(file_path):
            os.remove(file_path)

@router.post("/upload", response_model=DocumentResponse, status_code=status.HTTP_202_ACCEPTED)
async def upload_document(
    background_tasks: BackgroundTasks,
    project_id: str,
    file: UploadFile = File(...)
):
    # Restrict allowed file types
    allowed_types = [
        "application/pdf", 
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ]
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="Unsupported file type.")

    # Ensure the project exists
    project = await Project.get(project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found.")

    # Calculate SHA-256 for deduplication
    file_content = await file.read()
    file_hash = hashlib.sha256(file_content).hexdigest()
    
    existing_doc = await DocumentModel.find_one(
        DocumentModel.file_hash_sha256 == file_hash,
        DocumentModel.project.id == project.id
    )
    if existing_doc:
        raise HTTPException(status_code=409, detail="Document already exists in this project.")

    # Save file temporarily to disk for processing
    temp_path = os.path.join(UPLOAD_DIR, f"{file_hash}_{file.filename}")
    with open(temp_path, "wb") as buffer:
        buffer.write(file_content)

    file_size = os.path.getsize(temp_path)

    # Create the database record
    new_doc = DocumentModel(
        project=project,
        filename=file.filename,
        file_hash_sha256=file_hash,
        mime_type=file.content_type,
        file_size_bytes=file_size,
        status="UPLOADED"
    )
    await new_doc.insert()

    # Hand off the heavy parsing to a background task
    background_tasks.add_task(process_document_background, str(new_doc.id), temp_path, file.content_type)

    return DocumentResponse(
        id=str(new_doc.id),
        filename=new_doc.filename,
        fingerprint=new_doc.fingerprint,
        status=new_doc.status,
        statistics=new_doc.statistics,
        created_at=new_doc.created_at
    )

@router.get("/", response_model=List[DocumentResponse])
async def list_documents(project_id: str):
    project = await Project.get(project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found.")
        
    docs = await DocumentModel.find(DocumentModel.project.id == project.id).to_list()
    
    return [
        DocumentResponse(
            id=str(d.id),
            filename=d.filename,
            fingerprint=d.fingerprint,
            status=d.status,
            statistics=d.statistics,
            created_at=d.created_at
        ) for d in docs
    ]

@router.get("/{document_id}", response_model=DocumentResponse)
async def get_document(document_id: str):
    doc = await DocumentModel.get(document_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found.")
        
    return DocumentResponse(
        id=str(doc.id),
        filename=doc.filename,
        fingerprint=doc.fingerprint,
        status=doc.status,
        statistics=doc.statistics,
        created_at=doc.created_at
    )