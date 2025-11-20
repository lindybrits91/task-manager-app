"""SQLAlchemy user repository implementation."""
from typing import Optional

from sqlalchemy.orm import Session

from domain.models import User
from domain.ports import UserRepository
from infrastructure.database.models import UserModel


class SQLAlchemyUserRepository(UserRepository):
    """SQLAlchemy implementation of user repository."""

    def __init__(self, session: Session):
        """Initialize repository with database session."""
        self.session = session

    def get_by_id(self, user_id: int) -> Optional[User]:
        """Get a user by id."""
        db_user = self.session.query(UserModel).filter(UserModel.id == user_id).first()
        if not db_user:
            return None
        return self._to_domain(db_user)

    def get_by_name(self, first_name: str, last_name: str) -> Optional[User]:
        """Get a user by first and last name."""
        db_user = self.session.query(UserModel).filter(
            UserModel.first_name == first_name,
            UserModel.last_name == last_name
        ).first()
        if not db_user:
            return None
        return self._to_domain(db_user)

    def create(self, user: User) -> User:
        """Create a new user."""
        db_user = UserModel(
            first_name=user.first_name,
            last_name=user.last_name,
            email=user.email,
            created_at=user.created_at,
            updated_at=user.updated_at,
        )
        self.session.add(db_user)
        self.session.commit()
        self.session.refresh(db_user)
        return self._to_domain(db_user)

    def get_all(self) -> list[User]:
        """Get all users."""
        db_users = self.session.query(UserModel).all()
        return [self._to_domain(db_user) for db_user in db_users]

    def _to_domain(self, db_user: UserModel) -> User:
        """Convert database model to domain model."""
        return User(
            id=db_user.id,
            first_name=db_user.first_name,
            last_name=db_user.last_name,
            email=db_user.email,
            created_at=db_user.created_at,
            updated_at=db_user.updated_at,
        )
