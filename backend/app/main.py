from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.database import init_db
from app.api.v1 import documents

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan context manager handles startup and shutdown events.
    Initializes the MongoDB connection and Beanie ODM on boot.
    """
    print(f"Starting {settings.PROJECT_NAME} engine...")
    await init_db()
    yield
    print(f"Shutting down {settings.PROJECT_NAME} engine...")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan
)

# Configure CORS to permit the Vite frontend workstation
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API routers
app.include_router(
    documents.router, 
    prefix=f"{settings.API_V1_STR}/documents", 
    tags=["Documents"]
)

@app.get("/health", tags=["System"])
async def health_check():
    """Simple health probe for the API."""
    return {
        "status": "ok", 
        "service": settings.PROJECT_NAME,
        "database": "connected"
    }