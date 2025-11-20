"""FastAPI application entry point."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from infrastructure.database import Base, engine
from presentation.api.routes import tasks_router, users_router

# Create database tables
Base.metadata.create_all(bind=engine)

# Create FastAPI app
app = FastAPI(
    title="Task Management API",
    description="REST API for task management with Hexagonal architecture",
    version="1.0.0",
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(tasks_router)
app.include_router(users_router)

@app.get("/health")
def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}
