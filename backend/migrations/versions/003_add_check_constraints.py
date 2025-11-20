"""Add CHECK constraints for non-empty strings.

Revision ID: 003
Revises: 002
Create Date: 2025-01-20

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '003'
down_revision: Union[str, None] = '002'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Add CHECK constraints to ensure non-empty strings."""
    # Add CHECK constraints to users table
    op.create_check_constraint(
        'check_first_name_not_empty',
        'users',
        'LENGTH(TRIM(first_name)) > 0'
    )
    op.create_check_constraint(
        'check_last_name_not_empty',
        'users',
        'LENGTH(TRIM(last_name)) > 0'
    )

    # Add CHECK constraints to tasks table
    op.create_check_constraint(
        'check_description_not_empty',
        'tasks',
        'LENGTH(TRIM(description)) > 0'
    )
    op.create_check_constraint(
        'check_description_max_length',
        'tasks',
        'LENGTH(description) <= 500'
    )


def downgrade() -> None:
    """Remove CHECK constraints."""
    # Remove CHECK constraints from tasks table
    op.drop_constraint('check_description_max_length', 'tasks', type_='check')
    op.drop_constraint('check_description_not_empty', 'tasks', type_='check')

    # Remove CHECK constraints from users table
    op.drop_constraint('check_last_name_not_empty', 'users', type_='check')
    op.drop_constraint('check_first_name_not_empty', 'users', type_='check')
