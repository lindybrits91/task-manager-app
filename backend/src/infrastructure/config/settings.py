"""Application settings."""
from functools import lru_cache

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings."""

    # Database
    database_url: str = "postgresql://user:password@localhost:5432/chemify_db"
    postgres_user: str = "user"
    postgres_password: str = "password"
    postgres_db: str = "chemify_db"
    postgres_host: str = "localhost"
    postgres_port: int = 5432

    # Application
    app_host: str = "0.0.0.0"
    app_port: int = 8000
    debug: bool = True

    class Config:
        """Pydantic config."""

        env_file = ".env"
        case_sensitive = False


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()
