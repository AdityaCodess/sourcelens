from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.core.config import settings

# We will import the models here to register them with Beanie
from app.models.project import Project
from app.models.document import Document
from app.models.passage import Passage
from app.models.match import Match
from app.models.corpus import Corpus

async def init_db():
    """
    Initializes the MongoDB connection and registers Beanie ODM models.
    """
    client = AsyncIOMotorClient(settings.MONGODB_URI)
    database = client[settings.MONGODB_DB_NAME]
    
    await init_beanie(
        database=database,
        document_models=[
            Project,
            Document,
            Passage,
            Match,
            Corpus
        ]
    )
    print(f"Connected to MongoDB Atlas: {settings.MONGODB_DB_NAME}")