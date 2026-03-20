"""
Alembic environment (Flask-SQLAlchemy).
"""
import os
from logging.config import fileConfig

from alembic import context
from sqlalchemy import pool
from sqlalchemy import engine_from_config

from app import create_app
from app.extensions import db

# Register models on db.metadata
import app.models  # noqa: F401

config = context.config

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

flask_app = create_app(os.getenv("FLASK_ENV", "development"))
target_metadata = db.metadata


def get_database_url() -> str:
    return str(flask_app.config["SQLALCHEMY_DATABASE_URI"])


config.set_main_option("sqlalchemy.url", get_database_url().replace("%", "%%"))


def run_migrations_offline() -> None:
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    cfg = config.get_section(config.config_ini_section, {})
    cfg["sqlalchemy.url"] = get_database_url()
    connectable = engine_from_config(
        cfg,
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            compare_type=True,
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
