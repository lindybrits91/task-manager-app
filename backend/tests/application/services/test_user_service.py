"""Tests for UserService."""

from datetime import UTC, datetime
from unittest.mock import Mock

import pytest

from application.services import UserService
from domain.models import User


class TestUserService:
    """Test cases for UserService."""

    @pytest.fixture
    def mock_user_repository(self):
        """Create a mock user repository."""
        return Mock()

    @pytest.fixture
    def user_service(self, mock_user_repository):
        """Create a UserService instance with mocked repository."""
        return UserService(mock_user_repository)

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
    def sample_users(self):
        """Create a list of sample users."""
        now = datetime.now(UTC)
        return [
            User(
                id=1,
                first_name="John",
                last_name="Doe",
                email="john.doe@example.com",
                created_at=now,
                updated_at=now,
            ),
            User(
                id=2,
                first_name="Jane",
                last_name="Smith",
                email="jane.smith@example.com",
                created_at=now,
                updated_at=now,
            ),
            User(
                id=3,
                first_name="Bob",
                last_name="Johnson",
                email="bob.johnson@example.com",
                created_at=now,
                updated_at=now,
            ),
        ]

    def test_get_all_users_success(self, user_service, mock_user_repository, sample_users):
        """Test successfully getting all users."""
        # Arrange
        mock_user_repository.get_all.return_value = sample_users

        # Act
        result = user_service.get_all_users()

        # Assert
        assert result == sample_users
        assert len(result) == 3
        mock_user_repository.get_all.assert_called_once()

    def test_get_all_users_empty(self, user_service, mock_user_repository):
        """Test getting all users when no users exist."""
        # Arrange
        mock_user_repository.get_all.return_value = []

        # Act
        result = user_service.get_all_users()

        # Assert
        assert result == []
        assert len(result) == 0
        mock_user_repository.get_all.assert_called_once()

    def test_get_user_by_id_success(self, user_service, mock_user_repository, sample_user):
        """Test successfully getting a user by id."""
        # Arrange
        mock_user_repository.get_by_id.return_value = sample_user

        # Act
        result = user_service.get_user_by_id(user_id=1)

        # Assert
        assert result == sample_user
        assert result.id == 1
        assert result.first_name == "John"
        assert result.last_name == "Doe"
        assert result.email == "john.doe@example.com"
        mock_user_repository.get_by_id.assert_called_once_with(1)

    def test_get_user_by_id_not_found(self, user_service, mock_user_repository):
        """Test getting a non-existent user by id."""
        # Arrange
        mock_user_repository.get_by_id.return_value = None

        # Act & Assert
        with pytest.raises(ValueError, match="User with id 999 not found"):
            user_service.get_user_by_id(user_id=999)

        mock_user_repository.get_by_id.assert_called_once_with(999)

    def test_get_user_by_id_with_different_ids(self, user_service, mock_user_repository, sample_users):
        """Test getting users with different IDs."""
        # Arrange
        mock_user_repository.get_by_id.side_effect = lambda user_id: next(
            (user for user in sample_users if user.id == user_id), None
        )

        # Act & Assert - User 1
        result1 = user_service.get_user_by_id(user_id=1)
        assert result1.id == 1
        assert result1.first_name == "John"

        # Act & Assert - User 2
        result2 = user_service.get_user_by_id(user_id=2)
        assert result2.id == 2
        assert result2.first_name == "Jane"

        # Act & Assert - User 3
        result3 = user_service.get_user_by_id(user_id=3)
        assert result3.id == 3
        assert result3.first_name == "Bob"

        # Verify calls
        assert mock_user_repository.get_by_id.call_count == 3
