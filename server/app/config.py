from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    DATABASE_URL: str
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    ALLOWED_ORIGINS: List[str] = ["http://localhost:5173", "http://127.0.0.1:5173"]
    SECRET_KEY: str

    model_config = {
        "env_file": ".env",
        "case_sensitive": True
    }


settings = Settings()
