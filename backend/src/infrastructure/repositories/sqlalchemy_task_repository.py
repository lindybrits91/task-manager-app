"""SQLAlchemy task repository implementation."""
from datetime import datetime, timezone
from typing import List, Optional

from sqlalchemy.orm import Session

from domain.models import Task, TaskStatus
from domain.ports import TaskRepository
from infrastructure.database.models import TaskModel


class SQLAlchemyTaskRepository(TaskRepository):
    """SQLAlchemy implementation of task repository."""

    def __init__(self, session: Session):
        """Initialize repository with database session."""
        self.session = session

    def create(self, task: Task) -> Task:
        """Create a new task."""
        db_task = TaskModel(
            description=task.description,
            status=task.status,
            user_id=task.user_id,
            created_at=task.created_at,
            updated_at=task.updated_at,
        )
        self.session.add(db_task)
        self.session.commit()
        self.session.refresh(db_task)
        return self._to_domain(db_task)

    def update(self, task: Task) -> Task:
        """Update an existing task."""
        db_task = self.session.query(TaskModel).filter(TaskModel.id == task.id).first()
        if not db_task:
            raise ValueError(f"Task with id {task.id} not found")

        db_task.description = task.description
        db_task.status = task.status
        db_task.user_id = task.user_id
        db_task.updated_at = datetime.now(timezone.utc)

        self.session.commit()
        self.session.refresh(db_task)
        return self._to_domain(db_task)

    def delete(self, task_id: int) -> bool:
        """Delete a task by id."""
        db_task = self.session.query(TaskModel).filter(TaskModel.id == task_id).first()
        if not db_task:
            return False

        self.session.delete(db_task)
        self.session.commit()
        return True

    def get_by_id(self, task_id: int) -> Optional[Task]:
        """Get a task by id."""
        db_task = self.session.query(TaskModel).filter(TaskModel.id == task_id).first()
        if not db_task:
            return None
        return self._to_domain(db_task)

    def get_by_user_id(self, user_id: int) -> List[Task]:
        """Get all tasks for a specific user."""
        db_tasks = self.session.query(TaskModel).filter(TaskModel.user_id == user_id).all()
        return [self._to_domain(db_task) for db_task in db_tasks]

    def get_all(self) -> List[Task]:
        """Get all tasks ordered by creation time."""
        db_tasks = self.session.query(TaskModel).order_by(TaskModel.created_at.asc()).all()
        return [self._to_domain(db_task) for db_task in db_tasks]

    def _to_domain(self, db_task: TaskModel) -> Task:
        """Convert database model to domain model."""
        return Task(
            id=db_task.id,
            description=db_task.description,
            status=TaskStatus(db_task.status),
            user_id=db_task.user_id,
            created_at=db_task.created_at,
            updated_at=db_task.updated_at,
        )
