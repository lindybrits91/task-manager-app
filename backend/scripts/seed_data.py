"""Seed data script for testing."""
import sys
from datetime import datetime, timezone
from pathlib import Path

# Add src to path
sys.path.insert(0, str(Path(__file__).parent.parent / "src"))

from infrastructure.database import Base, engine, SessionLocal
from infrastructure.database.models import TaskModel, UserModel
from domain.models.task import TaskStatus


def seed_database():
    """Seed the database with test data."""
    print("Starting database seeding...")

    # Create tables if they don't exist
    Base.metadata.create_all(bind=engine)

    # Create session
    db = SessionLocal()

    try:
        # Check if users already exist
        existing_users = db.query(UserModel).count()
        if existing_users > 0:
            print(f"Database already has {existing_users} users. Skipping seed.")
            return

        # Create test users
        now = datetime.now(timezone.utc)
        users = [
            UserModel(first_name="Alice", last_name="Johnson", email="alice.johnson@example.com", created_at=now, updated_at=now),
            UserModel(first_name="Bob", last_name="Smith", email="bob.smith@example.com", created_at=now, updated_at=now),
            UserModel(first_name="Charlie", last_name="Brown", email="charlie.brown@example.com", created_at=now, updated_at=now),
            UserModel(first_name="Diana", last_name="Prince", email="diana.prince@example.com", created_at=now, updated_at=now),
            UserModel(first_name="Eve", last_name="Martinez", email="eve.martinez@example.com", created_at=now, updated_at=now),
        ]

        db.add_all(users)
        db.commit()
        print(f"Created {len(users)} users")

        # Refresh users to get their IDs
        for user in users:
            db.refresh(user)

        # Create test tasks for each user
        tasks = [
            # Tasks for Alice Johnson
            TaskModel(
                description="Complete project documentation",
                status=TaskStatus.TODO,
                user_id=users[0].id,
                created_at=datetime.now(timezone.utc),
                updated_at=datetime.now(timezone.utc),
            ),
            TaskModel(
                description="Review pull requests",
                status=TaskStatus.DOING,
                user_id=users[0].id,
                created_at=datetime.now(timezone.utc),
                updated_at=datetime.now(timezone.utc),
            ),
            TaskModel(
                description="Write unit tests",
                status=TaskStatus.DONE,
                user_id=users[0].id,
                created_at=datetime.now(timezone.utc),
                updated_at=datetime.now(timezone.utc),
            ),
            # Tasks for Bob Smith
            TaskModel(
                description="Design new feature UI",
                status=TaskStatus.TODO,
                user_id=users[1].id,
                created_at=datetime.now(timezone.utc),
                updated_at=datetime.now(timezone.utc),
            ),
            TaskModel(
                description="Implement authentication",
                status=TaskStatus.DOING,
                user_id=users[1].id,
                created_at=datetime.now(timezone.utc),
                updated_at=datetime.now(timezone.utc),
            ),
            # Tasks for Charlie Brown
            TaskModel(
                description="Set up CI/CD pipeline",
                status=TaskStatus.DONE,
                user_id=users[2].id,
                created_at=datetime.now(timezone.utc),
                updated_at=datetime.now(timezone.utc),
            ),
            TaskModel(
                description="Database optimization",
                status=TaskStatus.TODO,
                user_id=users[2].id,
                created_at=datetime.now(timezone.utc),
                updated_at=datetime.now(timezone.utc),
            ),
            # Tasks for Diana Prince
            TaskModel(
                description="Update API endpoints",
                status=TaskStatus.DOING,
                user_id=users[3].id,
                created_at=datetime.now(timezone.utc),
                updated_at=datetime.now(timezone.utc),
            ),
            # Tasks for Eve Martinez
            TaskModel(
                description="Code review and refactoring",
                status=TaskStatus.TODO,
                user_id=users[4].id,
                created_at=datetime.now(timezone.utc),
                updated_at=datetime.now(timezone.utc),
            ),
        ]

        db.add_all(tasks)
        db.commit()
        print(f"Created {len(tasks)} tasks")

        print("Database seeding completed successfully!")

    except Exception as e:
        print(f"Error seeding database: {str(e)}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
