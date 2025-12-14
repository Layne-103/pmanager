# 🚀 Quick Start Guide

The fastest way to start development!

## One-Command Startup (Recommended)

```bash
./start-dev.sh
```

This will automatically start both backend and frontend servers.

## Manual Startup

### Backend (Terminal 1)

```bash
cd server
source .venv/bin/activate
export DATABASE_URL="postgresql://$(whoami):@localhost:5432/pmanager"
export SECRET_KEY="dev-secret-key"
uvicorn app.main:app --reload --port 8000
```

Note: Due to our custom project structure, you need to activate the virtual environment first.

### Frontend (Terminal 2)

```bash
cd client
npm run dev
```

## Access URLs

- 🎨 **Frontend**: http://localhost:5173
- 🔧 **Backend API**: http://localhost:8000
- 📚 **API Docs**: http://localhost:8000/docs

## First-Time Setup

If this is your first time running the project:

1. **Install PostgreSQL** (if not already installed):
```bash
brew install postgresql@15
brew services start postgresql@15
```

2. **Create database**:
```bash
createdb pmanager
```

3. **Backend setup**:
```bash
cd server
uv venv                          # Create virtual environment
uv pip install -r requirements.txt  # Install dependencies
export DATABASE_URL="postgresql://$(whoami):@localhost:5432/pmanager"
export SECRET_KEY="dev-secret-key"
source .venv/bin/activate
alembic upgrade head             # Run database migrations
```

4. **Frontend setup**:
```bash
cd client
npm install
```

5. **Start servers** (see "Manual Startup" section above)

## Common Commands

### Database Migrations

Create a new migration:
```bash
cd server
source .venv/bin/activate
alembic revision --autogenerate -m "Description"
```

Apply migrations:
```bash
cd server
source .venv/bin/activate
alembic upgrade head
```

Check current migration status:
```bash
cd server
source .venv/bin/activate
alembic current
```

### Install New Python Packages

```bash
cd server
uv pip install package-name
uv pip freeze > requirements.txt  # Update requirements.txt
```

### Install New npm Packages

```bash
cd client
npm install package-name
```

## Performance Comparison

Using **uv** instead of traditional pip:

| Operation | pip | uv |
|-----------|-----|-----|
| Create virtual environment | ~5-10s | <1s |
| Install all dependencies | ~10-30s | ~0.2-1s |
| Install single package | ~2-5s | <0.5s |

In our project, installing all dependencies with uv takes only **37ms**!

## Why Use uv?

- ⚡ **Extremely Fast**: Written in Rust, 10-100x faster than pip
- 🔒 **Reliable**: Better dependency resolution
- 🚀 **Modern**: Actively maintained by Astral (creators of ruff)
- 🔄 **Compatible**: Fully compatible with existing pip workflows

See [UV_SETUP.md](UV_SETUP.md) for detailed information.

## Troubleshooting

### PostgreSQL Not Running

```bash
brew services start postgresql@15
```

### Database Does Not Exist

```bash
createdb pmanager
```

### Port Already in Use

Find process using the port:
```bash
lsof -i :8000  # Backend
lsof -i :5173  # Frontend
```

Kill the process:
```bash
kill -9 <PID>
```

### Module Not Found

Reinstall dependencies:
```bash
cd server
uv pip install -r requirements.txt
```

## Development Workflow

1. Pull latest code: `git pull`
2. Update dependencies: `cd server && uv pip install -r requirements.txt`
3. Run migrations: `cd server && source .venv/bin/activate && alembic upgrade head`
4. Start servers: `./start-dev.sh`
5. Start coding! 🎉

## Next Steps

Phase 1 (Core Infrastructure) is complete!

See [README.md](README.md) for complete project documentation.

See [specs/0002-implementation-plan.md](specs/0002-implementation-plan.md) for the implementation plan.
