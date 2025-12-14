# UV Setup Guide

This project now uses **uv** - a fast Python package manager written in Rust, which is 10-100x faster than pip!

## What is uv?

uv is a modern Python package manager that:
- ⚡ Installs packages 10-100x faster than pip
- 🔒 Provides reliable dependency resolution
- 🚀 Creates virtual environments instantly
- 📦 Works as a drop-in replacement for pip

## Installation

### macOS/Linux
```bash
brew install uv
```

Or:
```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

### Using pip
```bash
pip install uv
```

## Quick Start

### Create Virtual Environment
```bash
cd server
uv venv
```

This creates a `.venv` directory (much faster than `python -m venv`).

### Activate Virtual Environment
```bash
source .venv/bin/activate  # macOS/Linux
.venv\Scripts\activate     # Windows
```

### Install Dependencies
```bash
uv pip install -r requirements.txt
```

This is **significantly faster** than `pip install`.

### Run Commands After Activation
```bash
source .venv/bin/activate
uvicorn app.main:app --reload --port 8000
```

Note: For our project structure, it's recommended to activate the virtual environment first.

## Common Commands

### Install a package
```bash
uv pip install fastapi
```

### Install from requirements.txt
```bash
uv pip install -r requirements.txt
```

### Update all packages
```bash
uv pip install --upgrade -r requirements.txt
```

### Generate requirements.txt
```bash
uv pip freeze > requirements.txt
```

### Sync dependencies
```bash
uv pip sync requirements.txt
```

## Performance Comparison

Installing all backend dependencies:
- **pip**: ~10-30 seconds
- **uv**: ~0.2-1 seconds (37ms in our case!)

Creating virtual environment:
- **python -m venv**: ~5-10 seconds
- **uv venv**: <1 second

## Why uv?

1. **Speed**: Written in Rust, optimized for performance
2. **Reliability**: Better dependency resolution
3. **Compatibility**: Works with existing pip/virtualenv workflows
4. **Modern**: Active development by Astral (creators of ruff)

## Migration from pip

Our project has been migrated to use uv:
- ✅ Virtual environment: `.venv` (instead of `venv`)
- ✅ All dependencies installed with `uv pip`
- ✅ Documentation updated
- ✅ Scripts updated

### Old Way (pip)
```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### New Way (uv)
```bash
uv venv
source .venv/bin/activate
uv pip install -r requirements.txt
uvicorn app.main:app --reload
```

Recommended approach:
```bash
uv venv
source .venv/bin/activate
uv pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Learn More

- Official Website: https://github.com/astral-sh/uv
- Documentation: https://docs.astral.sh/uv/

## Notes

- The `.venv` directory is gitignored
- All existing pip workflows continue to work
- You can switch back to pip anytime if needed
- uv is actively maintained and production-ready
