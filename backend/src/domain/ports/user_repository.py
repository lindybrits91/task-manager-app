"""User repository port (interface)."""

from abc import ABC, abstractmethod

from domain.models import User


class UserRepository(ABC):
    """Abstract user repository interface."""

    @abstractmethod
    def get_by_id(self, user_id: int) -> User | None:
        """Get a user by id."""
        pass

    @abstractmethod
    def get_by_name(self, first_name: str, last_name: str) -> User | None:
        """Get a user by first and last name."""
        pass

    @abstractmethod
    def create(self, user: User) -> User:
        """Create a new user."""
        pass

    @abstractmethod
    def get_all(self) -> list[User]:
        """Get all users."""
        pass
