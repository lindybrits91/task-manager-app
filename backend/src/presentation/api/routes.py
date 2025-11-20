"""API routes for tasks and users."""
from typing import List

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from application.services import TaskService, UserService
from domain.models import TaskStatus
from infrastructure.database import get_db
from infrastructure.repositories import SQLAlchemyTaskRepository, SQLAlchemyUserRepository

# Create separate routers for tasks and users
tasks_router = APIRouter(prefix="/api", tags=["tasks"])
users_router = APIRouter(prefix="/api", tags=["users"])


# Pydantic models for request validation
class TaskCreateRequest(BaseModel):
    """Task creation request."""

    description: str = Field(..., min_length=1, description="Task description")
    status: TaskStatus = Field(..., description="Task status (TODO, DOING, or DONE)")
    user_id: int = Field(..., gt=0, description="User ID")


class TaskUpdateRequest(BaseModel):
    """Task update request."""

    description: str = Field(..., min_length=1, description="Task description")
    status: TaskStatus = Field(..., description="Task status (TODO, DOING, or DONE)")
    user_id: int = Field(..., gt=0, description="User ID")


class TaskResponse(BaseModel):
    """Task response."""

    id: int
    description: str
    status: str
    user_id: int
    created_at: str
    updated_at: str

    class Config:
        """Pydantic config."""

        from_attributes = True


class UserResponse(BaseModel):
    """User response."""

    id: int
    first_name: str
    last_name: str
    created_at: str

    class Config:
        """Pydantic config."""

        from_attributes = True


def get_task_service(db: Session = Depends(get_db)) -> TaskService:
    """Get task service with dependencies."""
    task_repo = SQLAlchemyTaskRepository(db)
    user_repo = SQLAlchemyUserRepository(db)
    return TaskService(task_repo, user_repo)


def get_user_service(db: Session = Depends(get_db)) -> UserService:
    """Get user service with dependencies."""
    user_repo = SQLAlchemyUserRepository(db)
    return UserService(user_repo)


@tasks_router.post("/tasks", response_model=TaskResponse, status_code=201)
def create_task(
    request: TaskCreateRequest,
    service: TaskService = Depends(get_task_service),
) -> TaskResponse:
    """Create a new task."""
    try:
        task = service.create_task(
            description=request.description,
            status=request.status,
            user_id=request.user_id,
        )
        return TaskResponse(
            id=task.id,
            description=task.description,
            status=task.status.value,
            user_id=task.user_id,
            created_at=task.created_at.isoformat(),
            updated_at=task.updated_at.isoformat(),
        )
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@tasks_router.put("/tasks/{task_id}", response_model=TaskResponse)
def update_task(
    task_id: int,
    request: TaskUpdateRequest,
    service: TaskService = Depends(get_task_service),
) -> TaskResponse:
    """Update an existing task."""
    try:
        task = service.update_task(
            task_id=task_id,
            description=request.description,
            status=request.status,
            user_id=request.user_id,
        )
        return TaskResponse(
            id=task.id,
            description=task.description,
            status=task.status.value,
            user_id=task.user_id,
            created_at=task.created_at.isoformat(),
            updated_at=task.updated_at.isoformat(),
        )
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@tasks_router.get("/tasks", response_model=List[TaskResponse])
def get_tasks(
    service: TaskService = Depends(get_task_service),
) -> List[TaskResponse]:
    """Get all tasks."""
    try:
        tasks = service.get_all_tasks()
        return [
            TaskResponse(
                id=task.id,
                description=task.description,
                status=task.status.value,
                user_id=task.user_id,
                created_at=task.created_at.isoformat(),
                updated_at=task.updated_at.isoformat(),
            )
            for task in tasks
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@tasks_router.delete("/tasks/{task_id}", status_code=204)
def delete_task(
    task_id: int,
    service: TaskService = Depends(get_task_service),
) -> None:
    """Delete a task."""
    try:
        service.delete_task(task_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@users_router.get("/users", response_model=List[UserResponse])
def get_users(
    service: UserService = Depends(get_user_service),
) -> List[UserResponse]:
    """Get all users."""
    try:
        users = service.get_all_users()
        return [
            UserResponse(
                id=user.id,
                first_name=user.first_name,
                last_name=user.last_name,
                email=user.email,
                created_at=user.created_at.isoformat(),
                updated_at=user.updated_at.isoformat(),
            )
            for user in users
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
