"""Add email field, indexes, and updated_at to users.

Revision ID: 004
Revises: 003
Create Date: 2025-01-20

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '004'
down_revision: Union[str, None] = '003'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Add email field, indexes, and updated_at field."""
    # Add email column to users table with temporary nullable
    op.add_column(
        'users',
        sa.Column('email', sa.String(length=255), nullable=True)
    )

    # Populate email addresses for existing users
    # Generate emails based on first_name.last_name@example.com
    op.execute("""
        UPDATE users
        SET email = LOWER(first_name || '.' || last_name || '@example.com')
    """)

    # Now make email non-nullable
    op.alter_column('users', 'email', nullable=False)

    # Create unique index on email
    op.create_index('ix_users_email', 'users', ['email'], unique=True)

    # Add CHECK constraint for email format
    op.create_check_constraint(
        'check_email_format',
        'users',
        "email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$'"
    )

    # Add updated_at column to users table
    op.add_column(
        'users',
        sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.text('CURRENT_TIMESTAMP'))
    )

    # Add index on tasks.user_id for better query performance
    op.create_index(
        'ix_tasks_user_id',
        'tasks',
        ['user_id']
    )


def downgrade() -> None:
    """Remove email field, indexes, and updated_at field."""
    # Drop index on tasks.user_id
    op.drop_index('ix_tasks_user_id', table_name='tasks')

    # Drop updated_at column from users table
    op.drop_column('users', 'updated_at')

    # Drop CHECK constraint for email format
    op.drop_constraint('check_email_format', 'users', type_='check')

    # Drop unique index on email
    op.drop_index('ix_users_email', table_name='users')

    # Drop email column from users table
    op.drop_column('users', 'email')
