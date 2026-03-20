"""
Application Configuration Classes
"""
import os
from datetime import timedelta


def _normalize_database_url(database_url: str | None) -> str | None:
    """Normalize provider URLs for SQLAlchemy compatibility."""
    if not database_url:
        return None
    if database_url.startswith("postgres://"):
        return database_url.replace("postgres://", "postgresql://", 1)
    return database_url


def _parse_cors_origins(value: str | None):
    """Parse comma-separated CORS origins into list or wildcard."""
    if not value:
        return "*"
    if value.strip() == "*":
        return "*"
    origins = [origin.strip() for origin in value.split(",") if origin.strip()]
    return origins or "*"


class BaseConfig:
    """Base configuration shared across all environments."""
    SECRET_KEY = os.getenv("SECRET_KEY", "fallback-secret-key-change-in-production")

    # SQLAlchemy
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ENGINE_OPTIONS = {
        "pool_pre_ping": True,
        "pool_size": 10,
        "max_overflow": 20,
        "pool_recycle": 300,
    }

    # JWT
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "jwt-fallback-secret-change-in-production")
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)
    JWT_TOKEN_LOCATION = ["headers"]
    JWT_HEADER_NAME = "Authorization"
    JWT_HEADER_TYPE = "Bearer"

    # Redis
    REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

    # Celery
    CELERY_BROKER_URL = os.getenv("CELERY_BROKER_URL", "redis://localhost:6379/1")
    CELERY_RESULT_BACKEND = os.getenv("CELERY_RESULT_BACKEND", "redis://localhost:6379/2")

    # Elasticsearch
    ELASTICSEARCH_URL = os.getenv("ELASTICSEARCH_URL", "http://localhost:9200")

    # Mail
    MAIL_SERVER = os.getenv("MAIL_SERVER", "smtp.gmail.com")
    MAIL_PORT = int(os.getenv("MAIL_PORT", 587))
    MAIL_USE_TLS = os.getenv("MAIL_USE_TLS", "true").lower() == "true"
    MAIL_USERNAME = os.getenv("MAIL_USERNAME")
    MAIL_PASSWORD = os.getenv("MAIL_PASSWORD")
    MAIL_DEFAULT_SENDER = os.getenv("MAIL_DEFAULT_SENDER", "noreply@techzone.com")

    # File uploads
    MAX_CONTENT_LENGTH = int(os.getenv("MAX_CONTENT_LENGTH", 16 * 1024 * 1024))  # 16 MB
    UPLOAD_FOLDER = os.getenv("UPLOAD_FOLDER", os.path.join(os.path.dirname(__file__), "..", "uploads"))
    ALLOWED_IMAGE_EXTENSIONS = {"png", "jpg", "jpeg", "webp", "gif"}

    # Stripe
    STRIPE_PUBLIC_KEY = os.getenv("STRIPE_PUBLIC_KEY", "")
    STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY", "")
    STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET", "")

    # Pagination
    DEFAULT_PAGE_SIZE = 20
    MAX_PAGE_SIZE = 100

    # CORS
    CORS_ORIGINS = _parse_cors_origins(os.getenv("CORS_ORIGINS", "*"))

    # Price tracker
    PRICE_CHECK_INTERVAL_HOURS = 6

    # Warranty
    WARRANTY_REMINDER_DAYS = 30


class DevelopmentConfig(BaseConfig):
    """Development configuration."""
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = _normalize_database_url(os.getenv(
        "DATABASE_URL",
        "postgresql://techzone:techzone_secret@localhost:5432/techzone"
    ))
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)


class TestingConfig(BaseConfig):
    """Testing configuration."""
    TESTING = True
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = _normalize_database_url(os.getenv(
        "TEST_DATABASE_URL",
        "postgresql://techzone:techzone_secret@localhost:5432/techzone_test"
    ))
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
    ELASTICSEARCH_URL = None


class ProductionConfig(BaseConfig):
    """Production configuration."""
    DEBUG = False
    SECRET_KEY = os.getenv("SECRET_KEY")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
    SQLALCHEMY_DATABASE_URI = _normalize_database_url(os.getenv("DATABASE_URL"))
    # Omit ES unless explicitly configured (Base default localhost breaks search health on PaaS)
    ELASTICSEARCH_URL = os.getenv("ELASTICSEARCH_URL") or None
    SQLALCHEMY_ENGINE_OPTIONS = {
        **BaseConfig.SQLALCHEMY_ENGINE_OPTIONS,
        "pool_size": 20,
        "max_overflow": 40,
    }

    @classmethod
    def validate(cls):
        required_vars = {
            "SECRET_KEY": cls.SECRET_KEY,
            "JWT_SECRET_KEY": cls.JWT_SECRET_KEY,
            "DATABASE_URL": cls.SQLALCHEMY_DATABASE_URI,
        }
        missing = [name for name, value in required_vars.items() if not value]
        if missing:
            missing_vars = ", ".join(missing)
            raise RuntimeError(f"Missing required production environment variables: {missing_vars}")


config_by_name = {
    "development": DevelopmentConfig,
    "testing": TestingConfig,
    "production": ProductionConfig,
}
