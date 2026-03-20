"""initial_schema

Revision ID: a1b2c3d4e5f6
Revises:
Create Date: 2026-03-20

"""
import os

from alembic import op

from app import create_app
from app.extensions import db

import app.models  # noqa: F401

revision = "a1b2c3d4e5f6"
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    app = create_app(os.getenv("FLASK_ENV", "development"))
    with app.app_context():
        bind = op.get_bind()
        db.metadata.create_all(bind=bind)


def downgrade():
    app = create_app(os.getenv("FLASK_ENV", "development"))
    with app.app_context():
        bind = op.get_bind()
        db.metadata.drop_all(bind=bind)
