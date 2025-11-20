"""Update user model - replace username with first_name and last_name.

Revision ID: 002
Revises: 001
Create Date: 2025-01-18

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '002'
down_revision: Union[str, None] = '001'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Replace username with first_name and last_name."""
    # Drop the old username index
    op.drop_index('ix_users_username', table_name='users')

    # Drop the old username column
    op.drop_column('users', 'username')

    # Add new columns
    op.add_column('users', sa.Column('first_name', sa.String(length=255), nullable=False, server_default=''))
    op.add_column('users', sa.Column('last_name', sa.String(length=255), nullable=False, server_default=''))

    # Remove server defaults after data migration
    op.alter_column('users', 'first_name', server_default=None)
    op.alter_column('users', 'last_name', server_default=None)


def downgrade() -> None:
    """Restore username column."""
    # Drop new columns
    op.drop_column('users', 'last_name')
    op.drop_column('users', 'first_name')

    # Restore username column
    op.add_column('users', sa.Column('username', sa.String(length=255), nullable=False))
    op.create_index('ix_users_username', 'users', ['username'], unique=True)
