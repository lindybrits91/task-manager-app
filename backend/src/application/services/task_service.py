"""Task service (business logic)."""

from datetime import UTC, datetime

from domain.models import Task, TaskStatus
from domain.ports import TaskRepository, UserRepository


class TaskService:
    """Task service."""

    def __init__(self, task_repository: TaskRepository, user_repository: UserRepository):
        """Initialize service with repositories."""
        self.task_repository = task_repository
        self.user_repository = user_repository

    def create_task(self, description: str, status: TaskStatus, user_id: int) -> Task:
        """Create a new task."""
        # Validate user exists
        user = self.user_repository.get_by_id(user_id)
        if not user:
            raise ValueError(f"User with id {user_id} not found")

        # Create task
        now = datetime.now(UTC)
        task = Task(
            id=None,
            description=description,
            status=status,
            user_id=user_id,
            created_at=now,
            updated_at=now,
        )
        return self.task_repository.create(task)

    def update_task(self, task_id: int, description: str, status: TaskStatus, user_id: int) -> Task:
        """Update an existing task."""
        # Get existing task
        existing_task = self.task_repository.get_by_id(task_id)
        if not existing_task:
            raise ValueError(f"Task with id {task_id} not found")

        # Validate new user exists
        user = self.user_repository.get_by_id(user_id)
        if not user:
            raise ValueError(f"User with id {user_id} not found")

        # Update task
        updated_task = Task(
            id=task_id,
            description=description,
            status=status,
            user_id=user_id,
            created_at=existing_task.created_at,
            updated_at=datetime.now(UTC),
        )
        return self.task_repository.update(updated_task)

    def delete_task(self, task_id: int) -> bool:
        """Delete a task."""
        # Check if task exists
        existing_task = self.task_repository.get_by_id(task_id)
        if not existing_task:
            raise ValueError(f"Task with id {task_id} not found")

        return self.task_repository.delete(task_id)

    def get_tasks_by_user(self, user_id: int) -> list[Task]:
        """Get all tasks for a user."""
        # Validate user exists
        user = self.user_repository.get_by_id(user_id)
        if not user:
            raise ValueError(f"User with id {user_id} not found")

        return self.task_repository.get_by_user_id(user_id)

    def get_all_tasks(self) -> list[Task]:
        """Get all tasks."""
        return self.task_repository.get_all()

    def get_task_by_id(self, task_id: int) -> Task:
        """Get a task by id."""
        task = self.task_repository.get_by_id(task_id)
        if not task:
            raise ValueError(f"Task with id {task_id} not found")
        return task
