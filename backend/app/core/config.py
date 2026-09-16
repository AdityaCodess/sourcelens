from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "SourceLens API"
    API_V1_STR: str = "/api/v1"
    
    # Database
    MONGODB_URI: str
    MONGODB_DB_NAME: str
    
    # Worker
    REDIS_URL: str
    
    # Security
    SECRET_KEY: str

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()