"""API schemas using TypedDict for external boundaries."""
from datetime import datetime
from typing import TypedDict

from domain.models.task import TaskStatus


class TaskCreateRequest(TypedDict):
    """Task creation request schema."""

    description: str
    status: TaskStatus
    user_id: int


class TaskUpdateRequest(TypedDict):
    """Task update request schema."""

    description: str
    status: TaskStatus
    user_id: int


class TaskResponse(TypedDict):
    """Task response schema."""

    id: int
    description: str
    status: str
    user_id: int
    created_at: str
    updated_at: str


class UserResponse(TypedDict):
    """User response schema."""

    id: int
    first_name: str
    last_name: str
    email: str
    created_at: str
    updated_at: str


class ErrorResponse(TypedDict):
    """Error response schema."""

    detail: str
