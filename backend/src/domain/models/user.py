"""User domain model."""
import re
from dataclasses import dataclass
from datetime import datetime
from typing import Optional


@dataclass
class User:
    """User domain entity."""

    id: Optional[int]
    first_name: str
    last_name: str
    email: str
    created_at: datetime
    updated_at: datetime

    def __post_init__(self):
        """Validate user data."""
        if not self.first_name or not self.first_name.strip():
            raise ValueError("First name cannot be empty")
        if not self.last_name or not self.last_name.strip():
            raise ValueError("Last name cannot be empty")
        if not self.email or not self.email.strip():
            raise ValueError("Email cannot be empty")
        if not self._is_valid_email(self.email):
            raise ValueError("Invalid email format")

    @staticmethod
    def _is_valid_email(email: str) -> bool:
        """Validate email format."""
        pattern = r'^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
        return bool(re.match(pattern, email))
