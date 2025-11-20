"""Task repository port (interface)."""
from abc import ABC, abstractmethod
from typing import List, Optional

from domain.models import Task


class TaskRepository(ABC):
    """Abstract task repository interface."""

    @abstractmethod
    def create(self, task: Task) -> Task:
        """Create a new task."""
        pass

    @abstractmethod
    def update(self, task: Task) -> Task:
        """Update an existing task."""
        pass

    @abstractmethod
    def delete(self, task_id: int) -> bool:
        """Delete a task by id."""
        pass

    @abstractmethod
    def get_by_id(self, task_id: int) -> Optional[Task]:
        """Get a task by id."""
        pass

    @abstractmethod
    def get_by_user_id(self, user_id: int) -> List[Task]:
        """Get all tasks for a specific user."""
        pass

    @abstractmethod
    def get_all(self) -> List[Task]:
        """Get all tasks."""
        pass
