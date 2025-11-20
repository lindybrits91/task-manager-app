# Task Management API

A REST API backend application for task management built with FastAPI and following Hexagonal Architecture (Ports and Adapters) pattern.

## Tech Stack

- **Python 3.13** - Programming language
- **FastAPI** - Modern web framework for building APIs
- **PostgreSQL 15** - Relational database
- **SQLAlchemy** - ORM and database toolkit
- **Alembic** - Database migration tool
- **Uvicorn** - ASGI server
- **Docker** - Containerization

## Architecture

This project follows the **Hexagonal Architecture** pattern (also known as Ports and Adapters), which promotes:

- Clear separation of concerns
- Independence from external frameworks and tools
- Testability
- Flexibility to swap implementations

### Project Structure

```
backend/
├── src/
│   ├── domain/              # Core business logic
│   │   ├── models/          # Domain entities (dataclasses)
│   │   └── ports/           # Repository interfaces
│   ├── application/         # Application business rules
│   │   └── services/        # Service implementations
│   ├── infrastructure/      # External implementations
│   │   ├── database/        # SQLAlchemy models and config
│   │   ├── repositories/    # Repository implementations
│   │   └── config/          # Settings and configuration
│   └── presentation/        # API layer
│       └── api/             # FastAPI routes and schemas
├── migrations/              # Alembic database migrations
├── scripts/                 # Utility scripts
├── requirements.txt         # Python dependencies
├── alembic.ini             # Alembic configuration
├── Dockerfile              # Docker image definition
└── .env.example            # Environment variables template
```

## Features

- **CRUD operations** for tasks
- **User management** with email-based identification
- **Input validation** with domain-level constraints
- **Database migrations** with Alembic
- **Database constraints** for data integrity:
  - Non-empty string checks on names and descriptions
  - Email format validation
  - Task description max length (500 characters)
  - Unique email addresses
- **Indexes** for query optimization
- **Docker support** for easy deployment
- **Clean architecture** with clear layer separation

## API Endpoints

### Tasks

- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/{id}` - Update an existing task
- `DELETE /api/tasks/{id}` - Delete a task

### Users

- `GET /api/users` - Get all users

### Health Check

- `GET /health` - Health check endpoint

## Prerequisites

- **Docker** and **Docker Compose**

That's it! No need to install Python, PostgreSQL, or manage virtual environments.

## Quick Start with Docker

### 1. Start the application

From the project root:

```bash
docker-compose up --build
```

This will:
- Start PostgreSQL database on port 5432
- Run database migrations automatically
- Seed the database with test users and tasks
- Start the API server on port 8000

### 2. Access the API

- **API**: http://localhost:8000
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### 3. Stop the application

```bash
docker-compose down
```

### 4. Clean restart (removes data)

```bash
docker-compose down -v
docker-compose up --build
```

## Test Data

When starting with Docker, the database is automatically seeded with:

**5 Test Users:**
- Alice Johnson (alice.johnson@example.com)
- Bob Smith (bob.smith@example.com)
- Charlie Brown (charlie.brown@example.com)
- Diana Prince (diana.prince@example.com)
- Eve Martinez (eve.martinez@example.com)

**9 Sample Tasks** distributed among users with different statuses (TODO, DOING, DONE)

## API Documentation

Once the server is running, interactive API documentation is available:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Usage Examples

### Get All Users

```bash
curl http://localhost:8000/api/users
```

### Get All Tasks

```bash
curl http://localhost:8000/api/tasks
```

### Create a Task

```bash
curl -X POST "http://localhost:8000/api/tasks" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Complete the API documentation",
    "status": "TODO",
    "user_id": 1
  }'
```

### Update a Task

```bash
curl -X PUT "http://localhost:8000/api/tasks/1" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Complete the API documentation",
    "status": "DOING",
    "user_id": 1
  }'
```

### Delete a Task

```bash
curl -X DELETE "http://localhost:8000/api/tasks/1"
```

## Database Schema

### Task

- `id` (int) - Unique identifier
- `description` (text) - Task description (max 500 characters)
- `status` (enum) - One of: TODO, DOING, DONE
- `user_id` (int, indexed) - Foreign key to users
- `created_at` (datetime) - Creation timestamp
- `updated_at` (datetime) - Last update timestamp

**Constraints:**
- Description cannot be empty or whitespace-only
- Description max length: 500 characters

### User

- `id` (int) - Unique identifier
- `first_name` (str) - User's first name
- `last_name` (str) - User's last name
- `email` (str, unique, indexed) - User's email address
- `created_at` (datetime) - Creation timestamp
- `updated_at` (datetime) - Last update timestamp

**Constraints:**
- First name and last name cannot be empty or whitespace-only
- Email must be unique and valid format
- Email format validated with regex pattern

## Database Migrations

Migrations are automatically run when starting with Docker. For manual migration management:

### View current migration version

```bash
docker-compose exec backend alembic current
```

### View migration history

```bash
docker-compose exec backend alembic history
```

### Create a new migration

```bash
docker-compose exec backend alembic revision --autogenerate -m "Description"
```

### Apply migrations

```bash
docker-compose exec backend alembic upgrade head
```

### Rollback migration

```bash
docker-compose exec backend alembic downgrade -1
```

## Development

### Architecture Layers

1. **Domain Layer** (`src/domain/`)
   - Core business entities (dataclasses)
   - Repository interfaces (ports)
   - Business validation rules
   - No external dependencies

2. **Application Layer** (`src/application/`)
   - Services orchestrating business logic
   - Uses domain entities and ports

3. **Infrastructure Layer** (`src/infrastructure/`)
   - SQLAlchemy database models
   - Repository implementations
   - Configuration management

4. **Presentation Layer** (`src/presentation/`)
   - FastAPI routes and endpoints
   - Request/response schemas (TypedDict)
   - HTTP-specific logic

### Key Design Decisions

- **TypedDict** for external API boundaries
- **Dataclasses** for internal domain models
- **Dependency Injection** for repositories and services
- **Repository Pattern** for data access abstraction
- **Database-level constraints** for data integrity
- **Domain-level validation** for business rules

## Task Status Values

- `TODO` - Task not started
- `DOING` - Task in progress
- `DONE` - Task completed

## Environment Configuration

Database configuration is managed in `docker-compose.yml`:

```yaml
DATABASE_URL: postgresql://taskmanager:taskmanager123@db:5432/taskmanager
```

For local development without Docker, create a `.env` file based on `.env.example`.

## Troubleshooting

### Port Already in Use

If port 8000 or 5432 is already in use:

```bash
# Stop containers
docker-compose down

# Find and kill process using the port
lsof -ti:8000 | xargs kill -9
lsof -ti:5432 | xargs kill -9
```

### Database Connection Issues

```bash
# Check if database container is running
docker-compose ps

# View logs
docker-compose logs db
docker-compose logs backend
```

### Fresh Start

```bash
# Remove all containers and volumes
docker-compose down -v

# Rebuild and restart
docker-compose up --build
```

## License

This project is for demonstration purposes.

## Author

Built with FastAPI and following clean architecture principles.
