"""Clear all data from the database."""

import sys
from pathlib import Path

# Add src to path
sys.path.insert(0, str(Path(__file__).parent.parent / "src"))

from infrastructure.database import SessionLocal
from infrastructure.database.models import TaskModel, UserModel


def clear_database():
    """Clear all data from the database."""
    print("Starting database clearing...")

    # Create session
    db = SessionLocal()

    try:
        # Delete all tasks first (due to foreign key constraint)
        deleted_tasks = db.query(TaskModel).delete()
        print(f"Deleted {deleted_tasks} tasks")

        # Delete all users
        deleted_users = db.query(UserModel).delete()
        print(f"Deleted {deleted_users} users")

        db.commit()
        print("Database cleared successfully!")

    except Exception as e:
        print(f"Error clearing database: {str(e)}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    response = input("Are you sure you want to clear all data? (yes/no): ")
    if response.lower() == "yes":
        clear_database()
    else:
        print("Operation cancelled.")
