# Ticket Manager

A simple, tag-based ticket management system for personal task tracking.

## Tech Stack

- **Backend:** Python + FastAPI + PostgreSQL
- **Frontend:** Vite + React + TypeScript + Tailwind CSS
- **Database:** PostgreSQL 15+

## Phase 1 Implementation Status ✅

### Completed Tasks

1. ✅ Python virtual environment and dependencies installed
2. ✅ FastAPI application with CORS configured
3. ✅ Database configuration and connection setup
4. ✅ Alembic initialized for migrations
5. ✅ SQLAlchemy models created (Ticket, Tag, ticket_tags)
6. ✅ Initial database migrations created and applied
7. ✅ Database triggers for updated_at implemented
8. ✅ Vite + React + TypeScript project created
9. ✅ Tailwind CSS configured
10. ✅ shadcn/ui foundation setup

### Database Schema

The database includes the following tables:
- `tickets`: Store ticket information with title, description, completion status
- `tags`: Store tag names with optional colors
- `ticket_tags`: Many-to-many relationship between tickets and tags

### Project Structure

```
pmanager/
├── server/              # Backend (FastAPI)
│   ├── app/
│   │   ├── models/     # SQLAlchemy models
│   │   ├── schemas/    # Pydantic schemas
│   │   ├── routers/    # API endpoints
│   │   ├── services/   # Business logic
│   │   ├── config.py   # Configuration
│   │   ├── database.py # Database setup
│   │   └── main.py     # FastAPI app
│   ├── alembic/        # Database migrations
│   └── requirements.txt
│
├── client/             # Frontend (React)
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── lib/        # Utilities
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── tailwind.config.js
│   └── package.json
│
└── specs/             # Specifications
    ├── 0001-spec.md
    └── 0002-implementation-plan.md
```

## Setup Instructions

### Prerequisites

- Python 3.11+
- Node.js 18+
- PostgreSQL 15+
- Git
- uv (fast Python package manager) - Install with: `brew install uv` or `pip install uv`

### Backend Setup

1. Create and activate virtual environment with uv:
```bash
cd server
uv venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
```

2. Install dependencies (much faster with uv):
```bash
uv pip install -r requirements.txt
```

3. Create `.env` file in project root:
```bash
DATABASE_URL=postgresql://yourusername:@localhost:5432/pmanager
SECRET_KEY=your-secret-key-here
ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

4. Create database:
```bash
createdb pmanager
```

5. Run migrations:
```bash
alembic upgrade head
```

6. Start the backend server:
```bash
uv run uvicorn app.main:app --reload --port 8000
```

Or activate the virtual environment first:
```bash
source .venv/bin/activate
uvicorn app.main:app --reload --port 8000
```

The API will be available at http://localhost:8000
API documentation: http://localhost:8000/docs

### Frontend Setup

1. Install dependencies:
```bash
cd client
npm install
```

2. Start the development server:
```bash
npm run dev
```

The frontend will be available at http://localhost:5173

## Development

### Running Both Servers

Terminal 1 - Backend:
```bash
cd server
source .venv/bin/activate
uvicorn app.main:app --reload --port 8000
```

Or use uv directly (no activation needed):
```bash
cd server
uv run uvicorn app.main:app --reload --port 8000
```

Terminal 2 - Frontend:
```bash
cd client
npm run dev
```

### Database Management

Create a new migration:
```bash
cd server
alembic revision --autogenerate -m "Description"
```

Apply migrations:
```bash
alembic upgrade head
```

Rollback migration:
```bash
alembic downgrade -1
```

## Next Steps

Phase 1 (Core Infrastructure) is complete! 

Next phases will implement:
- Phase 2: Backend API implementation (ticket and tag endpoints)
- Phase 3: Frontend foundation (routing, API client, layouts)
- Phase 4: Ticket management features (CRUD operations)
- Phase 5: Tag system implementation
- Phase 6: Filtering and search
- Phase 7: Polish and testing

## License

Private project for personal use.
