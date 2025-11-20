"""User service (business logic)."""
from typing import List

from domain.models import User
from domain.ports import UserRepository


class UserService:
    """User service."""

    def __init__(self, user_repository: UserRepository):
        """Initialize service with repository."""
        self.user_repository = user_repository

    def get_all_users(self) -> List[User]:
        """Get all users."""
        return self.user_repository.get_all()

    def get_user_by_id(self, user_id: int) -> User:
        """Get a user by id."""
        user = self.user_repository.get_by_id(user_id)
        if not user:
            raise ValueError(f"User with id {user_id} not found")
        return user
