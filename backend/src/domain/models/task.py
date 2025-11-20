"""Task domain model."""

from dataclasses import dataclass
from datetime import datetime
from enum import Enum


class TaskStatus(str, Enum):
    """Task status enumeration."""

    TODO = "TODO"
    DOING = "DOING"
    DONE = "DONE"


@dataclass
class Task:
    """Task domain entity."""

    id: int | None
    description: str
    status: TaskStatus
    user_id: int
    created_at: datetime
    updated_at: datetime

    def __post_init__(self):
        """Validate task data."""
        if not self.description or not self.description.strip():
            raise ValueError("Task description cannot be empty")
        if len(self.description) > 500:
            raise ValueError("Task description cannot exceed 500 characters")
        if self.user_id is None or self.user_id <= 0:
            raise ValueError("Valid user_id is required")
        if not isinstance(self.status, TaskStatus):
            raise ValueError(f"Status must be one of {[s.value for s in TaskStatus]}")
