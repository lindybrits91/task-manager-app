"""Tests for TaskService."""

from datetime import UTC, datetime
from unittest.mock import Mock

import pytest

from application.services import TaskService
from domain.models import Task, TaskStatus, User


class TestTaskService:
    """Test cases for TaskService."""

    @pytest.fixture
    def mock_task_repository(self):
        """Create a mock task repository."""
        return Mock()

    @pytest.fixture
    def mock_user_repository(self):
        """Create a mock user repository."""
        return Mock()

    @pytest.fixture
    def task_service(self, mock_task_repository, mock_user_repository):
        """Create a TaskService instance with mocked repositories."""
        return TaskService(mock_task_repository, mock_user_repository)

    @pytest.fixture
    def sample_user(self):
        """Create a sample user."""
        return User(
            id=1,
            first_name="John",
            last_name="Doe",
            email="john.doe@example.com",
            created_at=datetime.now(UTC),
            updated_at=datetime.now(UTC),
        )

    @pytest.fixture
    def sample_task(self):
        """Create a sample task."""
        return Task(
            id=1,
            description="Test task",
            status=TaskStatus.TODO,
            user_id=1,
            created_at=datetime.now(UTC),
            updated_at=datetime.now(UTC),
        )

    def test_create_task_success(
        self, task_service, mock_task_repository, mock_user_repository, sample_user, sample_task
    ):
        """Test successfully creating a task."""
        # Arrange
        mock_user_repository.get_by_id.return_value = sample_user
        mock_task_repository.create.return_value = sample_task

        # Act
        result = task_service.create_task(description="Test task", status=TaskStatus.TODO, user_id=1)

        # Assert
        assert result == sample_task
        mock_user_repository.get_by_id.assert_called_once_with(1)
        mock_task_repository.create.assert_called_once()

    def test_create_task_user_not_found(self, task_service, mock_task_repository, mock_user_repository):
        """Test creating a task with non-existent user."""
        # Arrange
        mock_user_repository.get_by_id.return_value = None

        # Act & Assert
        with pytest.raises(ValueError, match="User with id 999 not found"):
            task_service.create_task(description="Test task", status=TaskStatus.TODO, user_id=999)

        mock_user_repository.get_by_id.assert_called_once_with(999)
        mock_task_repository.create.assert_not_called()

    def test_update_task_success(
        self, task_service, mock_task_repository, mock_user_repository, sample_user, sample_task
    ):
        """Test successfully updating a task."""
        # Arrange
        mock_task_repository.get_by_id.return_value = sample_task
        mock_user_repository.get_by_id.return_value = sample_user
        updated_task = Task(
            id=1,
            description="Updated task",
            status=TaskStatus.DOING,
            user_id=1,
            created_at=sample_task.created_at,
            updated_at=datetime.now(UTC),
        )
        mock_task_repository.update.return_value = updated_task

        # Act
        result = task_service.update_task(task_id=1, description="Updated task", status=TaskStatus.DOING, user_id=1)

        # Assert
        assert result == updated_task
        mock_task_repository.get_by_id.assert_called_once_with(1)
        mock_user_repository.get_by_id.assert_called_once_with(1)
        mock_task_repository.update.assert_called_once()

    def test_update_task_not_found(self, task_service, mock_task_repository, mock_user_repository):
        """Test updating a non-existent task."""
        # Arrange
        mock_task_repository.get_by_id.return_value = None

        # Act & Assert
        with pytest.raises(ValueError, match="Task with id 999 not found"):
            task_service.update_task(task_id=999, description="Updated task", status=TaskStatus.DOING, user_id=1)

        mock_task_repository.get_by_id.assert_called_once_with(999)
        mock_user_repository.get_by_id.assert_not_called()
        mock_task_repository.update.assert_not_called()

    def test_update_task_user_not_found(self, task_service, mock_task_repository, mock_user_repository, sample_task):
        """Test updating a task with non-existent user."""
        # Arrange
        mock_task_repository.get_by_id.return_value = sample_task
        mock_user_repository.get_by_id.return_value = None

        # Act & Assert
        with pytest.raises(ValueError, match="User with id 999 not found"):
            task_service.update_task(task_id=1, description="Updated task", status=TaskStatus.DOING, user_id=999)

        mock_task_repository.get_by_id.assert_called_once_with(1)
        mock_user_repository.get_by_id.assert_called_once_with(999)
        mock_task_repository.update.assert_not_called()

    def test_delete_task_success(self, task_service, mock_task_repository, sample_task):
        """Test successfully deleting a task."""
        # Arrange
        mock_task_repository.get_by_id.return_value = sample_task
        mock_task_repository.delete.return_value = True

        # Act
        result = task_service.delete_task(task_id=1)

        # Assert
        assert result is True
        mock_task_repository.get_by_id.assert_called_once_with(1)
        mock_task_repository.delete.assert_called_once_with(1)

    def test_delete_task_not_found(self, task_service, mock_task_repository):
        """Test deleting a non-existent task."""
        # Arrange
        mock_task_repository.get_by_id.return_value = None

        # Act & Assert
        with pytest.raises(ValueError, match="Task with id 999 not found"):
            task_service.delete_task(task_id=999)

        mock_task_repository.get_by_id.assert_called_once_with(999)
        mock_task_repository.delete.assert_not_called()

    def test_get_tasks_by_user_success(
        self, task_service, mock_task_repository, mock_user_repository, sample_user, sample_task
    ):
        """Test getting all tasks for a user."""
        # Arrange
        mock_user_repository.get_by_id.return_value = sample_user
        mock_task_repository.get_by_user_id.return_value = [sample_task]

        # Act
        result = task_service.get_tasks_by_user(user_id=1)

        # Assert
        assert result == [sample_task]
        mock_user_repository.get_by_id.assert_called_once_with(1)
        mock_task_repository.get_by_user_id.assert_called_once_with(1)

    def test_get_tasks_by_user_not_found(self, task_service, mock_task_repository, mock_user_repository):
        """Test getting tasks for a non-existent user."""
        # Arrange
        mock_user_repository.get_by_id.return_value = None

        # Act & Assert
        with pytest.raises(ValueError, match="User with id 999 not found"):
            task_service.get_tasks_by_user(user_id=999)

        mock_user_repository.get_by_id.assert_called_once_with(999)
        mock_task_repository.get_by_user_id.assert_not_called()

    def test_get_all_tasks(self, task_service, mock_task_repository, sample_task):
        """Test getting all tasks."""
        # Arrange
        tasks = [sample_task, sample_task]
        mock_task_repository.get_all.return_value = tasks

        # Act
        result = task_service.get_all_tasks()

        # Assert
        assert result == tasks
        mock_task_repository.get_all.assert_called_once()

    def test_get_task_by_id_success(self, task_service, mock_task_repository, sample_task):
        """Test getting a task by id."""
        # Arrange
        mock_task_repository.get_by_id.return_value = sample_task

        # Act
        result = task_service.get_task_by_id(task_id=1)

        # Assert
        assert result == sample_task
        mock_task_repository.get_by_id.assert_called_once_with(1)

    def test_get_task_by_id_not_found(self, task_service, mock_task_repository):
        """Test getting a non-existent task by id."""
        # Arrange
        mock_task_repository.get_by_id.return_value = None

        # Act & Assert
        with pytest.raises(ValueError, match="Task with id 999 not found"):
            task_service.get_task_by_id(task_id=999)

        mock_task_repository.get_by_id.assert_called_once_with(999)
