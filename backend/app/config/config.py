import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "Enterprise Secure SaaS Platform"
    SECRET_KEY: str = "supersecretkeychangeinprod1234567890!"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    ALGORITHM: str = "HS256"
    
    # PostgreSQL Configuration
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "manager"
    POSTGRES_DB: str = "qa_lab"
    POSTGRES_PORT: str = "5432"
    
    # Vulnerability Lab Toggle Flag
    ENABLE_VULNERABILITY_LAB: bool = False

    # CORS configuration
    FRONTEND_URL: str = "http://localhost:3000"

    # Tell pydantic-settings to check backend/.env first
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

    @property
    def DATABASE_URL(self) -> str:
        return f"postgresql://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_SERVER}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"

settings = Settings()
