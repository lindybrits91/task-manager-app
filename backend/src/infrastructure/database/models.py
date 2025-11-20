"""SQLAlchemy database models."""
from sqlalchemy import CheckConstraint, Column, DateTime, Enum, ForeignKey, Integer, String, Text, UniqueConstraint, func
from sqlalchemy.orm import relationship

from infrastructure.database.base import Base
from domain.models.task import TaskStatus


class UserModel(Base):
    """User database model."""

    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    first_name = Column(String(255), nullable=False)
    last_name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False, unique=True)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)

    # Relationship
    tasks = relationship("TaskModel", back_populates="user", cascade="all, delete-orphan")

    # Constraints
    __table_args__ = (
        CheckConstraint("LENGTH(TRIM(first_name)) > 0", name="check_first_name_not_empty"),
        CheckConstraint("LENGTH(TRIM(last_name)) > 0", name="check_last_name_not_empty"),
        CheckConstraint("email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$'", name="check_email_format"),
    )


class TaskModel(Base):
    """Task database model."""

    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    description = Column(Text, nullable=False)
    status = Column(Enum(TaskStatus), nullable=False, default=TaskStatus.TODO)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)

    # Relationship
    user = relationship("UserModel", back_populates="tasks")

    # Constraints
    __table_args__ = (
        CheckConstraint("LENGTH(TRIM(description)) > 0", name="check_description_not_empty"),
        CheckConstraint("LENGTH(description) <= 500", name="check_description_max_length"),
    )
