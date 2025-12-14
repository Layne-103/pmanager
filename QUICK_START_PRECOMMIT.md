# Quick Start: Pre-commit Hooks

Quick reference for using pre-commit hooks in this project.

## One-Time Setup

```bash
# Automated setup (recommended)
./setup-dev.sh

# Or manual
pip install pre-commit
pre-commit install
pre-commit install --hook-type commit-msg
```

## Daily Workflow

```bash
# 1. Make your changes
vim some_file.py

# 2. Stage changes
git add .

# 3. Commit (hooks run automatically)
git commit -m "feat: add new feature"

# If hooks fail, fix issues and try again
git add .
git commit -m "feat: add new feature"
```

## Common Commands

```bash
# Run all hooks manually
pre-commit run --all-files

# Run specific hook
pre-commit run black --all-files
pre-commit run eslint --all-files

# Update hooks
pre-commit autoupdate

# Skip hooks (not recommended)
git commit --no-verify -m "message"
```

## Python

```bash
cd server

# Format code
black .
ruff check --fix .

# Type check
mypy app/

# Run tests
pytest
```

## TypeScript

```bash
cd client

# Format code
npm run format

# Lint code
npm run lint:fix

# Type check
npm run type-check

# Build
npm run build
```

## What Gets Checked

### Python (server/)
- ✅ Black (formatting)
- ✅ Ruff (linting + auto-fix)
- ✅ isort (import sorting)
- ✅ mypy (type checking)

### TypeScript (client/)
- ✅ ESLint (linting + auto-fix)
- ✅ Prettier (formatting)

### General
- ✅ Trailing whitespace
- ✅ End-of-file fixer
- ✅ YAML/JSON/TOML validation
- ✅ Large files check
- ✅ Merge conflict detection
- ✅ Markdown linting
- ✅ Shell script linting

### Commit Messages
- ✅ Conventional commits format
- ✅ Types: feat, fix, docs, style, refactor, perf, test, build, ci, chore

## Commit Message Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer]
```

### Examples

```bash
# Feature
git commit -m "feat: add tag filtering"

# Bug fix
git commit -m "fix: resolve CORS issue"

# With scope
git commit -m "feat(api): add pagination"

# Breaking change
git commit -m "feat!: redesign API

BREAKING CHANGE: API now uses different schema"
```

## CI/CD

Pre-commit hooks also run in GitHub Actions on every push/PR:

- `.github/workflows/ci.yml` - Main CI pipeline
- `.github/workflows/pr-checks.yml` - PR-specific checks

## Troubleshooting

```bash
# Hooks too slow? First run is slow, subsequent runs are fast

# Hook failing? Run with verbose
pre-commit run --all-files --verbose

# Cache issues?
pre-commit clean
pre-commit install-hooks

# Update to latest hook versions
pre-commit autoupdate
```

## More Information

- [Full Pre-commit Setup Guide](docs/PRE_COMMIT_SETUP.md)
- [Contributing Guide](CONTRIBUTING.md)
- [Pre-commit Documentation](https://pre-commit.com/)
