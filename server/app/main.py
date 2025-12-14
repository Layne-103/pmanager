from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routers import tickets, tags

app = FastAPI(
    title="Ticket Manager API",
    description="Simple tag-based ticket management system",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(tickets.router, prefix="/api/tickets", tags=["tickets"])
app.include_router(tags.router, prefix="/api/tags", tags=["tags"])


@app.get("/")
def read_root():
    return {"message": "Ticket Manager API", "status": "running"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}
