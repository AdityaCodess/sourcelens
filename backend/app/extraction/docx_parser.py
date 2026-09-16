import docx
from typing import Dict, Any, List

def parse_docx(file_path: str) -> Dict[str, Any]:
    """
    Extracts text and metadata from a DOCX file.
    Returns a dictionary containing the full text, paragraphs, and statistics.
    """
    document = docx.Document(file_path)
    
    paragraphs_data: List[Dict[str, Any]] = []
    full_text = ""
    word_count = 0
    
    for i, para in enumerate(document.paragraphs):
        text = para.text.strip()
        if not text:
            continue
            
        words = len(text.split())
        word_count += words
        
        paragraphs_data.append({
            "paragraph_index": i,
            "text": text,
            "word_count": words
        })
        
        full_text += text + "\n\n"
        
    return {
        "full_text": full_text.strip(),
        "paragraphs": paragraphs_data,
        "statistics": {
            "paragraph_count": len(paragraphs_data),
            "word_count": word_count
        }
    }