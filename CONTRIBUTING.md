# Contributing to Project Manager

Thank you for your interest in contributing! This document provides guidelines and
instructions for contributing to this project.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Code Style](#code-style)
- [Pre-commit Hooks](#pre-commit-hooks)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)
- [Commit Message Guidelines](#commit-message-guidelines)

## Getting Started

### Prerequisites

- **Python 3.11+** (3.13 recommended)
- **Node.js 20+** (22 recommended)
- **Git**
- **Docker** (optional, for containerized development)

### Development Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd pmanager
   ```

2. **Run the automated setup script**

   ```bash
   ./setup-dev.sh
   ```

   This script will:
   - Install pre-commit hooks
   - Install Python dependencies
   - Install Node.js dependencies
   - Set up pre-commit environments

3. **Manual setup (alternative)**

   If you prefer to set up manually:

   ```bash
   # Install pre-commit
   pip install pre-commit

   # Install pre-commit hooks
   pre-commit install
   pre-commit install --hook-type commit-msg

   # Install Python dependencies
   cd server
   pip install -r requirements.txt
   cd ..

   # Install Node.js dependencies
   cd client
   npm install
   cd ..
   ```

## Code Style

### Python

We use the following tools for Python code quality:

- **Black**: Code formatter (line length: 100)
- **Ruff**: Fast linter and formatter
- **isort**: Import sorting
- **mypy**: Static type checking

Configuration is in `pyproject.toml`.

**Manual formatting:**

```bash
cd server

# Format code
black .

# Lint code
ruff check .

# Fix linting issues
ruff check --fix .

# Type check
mypy app/
```

### TypeScript/JavaScript

We use the following tools for TypeScript code quality:

- **ESLint**: Linting
- **Prettier**: Code formatting
- **TypeScript**: Type checking

Configuration:
- ESLint: `client/eslint.config.js`
- Prettier: `.prettierrc`
- TypeScript: `client/tsconfig.json`

**Manual formatting:**

```bash
cd client

# Format code
npm run format

# Check formatting
npm run format:check

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Type check
npm run type-check
```

## Pre-commit Hooks

Pre-commit hooks are configured but **run MANUALLY only** (not automatic on commit). This gives you control over when to run code quality checks.

### What Gets Checked

**General:**
- Trailing whitespace removal
- End-of-file fixer
- YAML/JSON/TOML validation
- Large files detection
- Private key detection
- Merge conflict detection

**Python (server/):**
- Black formatting
- Ruff linting and formatting
- isort import sorting
- mypy type checking

**TypeScript (client/):**
- ESLint linting
- Prettier formatting

**Markdown:**
- Markdownlint

**Shell scripts:**
- Shellcheck

**Commit messages:**
- Gitlint (enforces conventional commit format)

### Running Pre-commit Manually (Recommended Before Committing)

```bash
# Run on all files (recommended before committing)
pre-commit run --all-files

# Run on staged files only
pre-commit run

# Run specific hook
pre-commit run black --all-files

# Update hooks to latest versions
pre-commit autoupdate
```

### Optional: Install Automatic Hooks

If you prefer hooks to run automatically on every commit:

```bash
pre-commit install
pre-commit install --hook-type commit-msg
```

To uninstall automatic hooks:

```bash
pre-commit uninstall
pre-commit uninstall --hook-type commit-msg
```

**Note**: Even without automatic hooks, CI will still run all checks on push/PR.

## Testing

### Python Tests

```bash
cd server

# Run all tests
pytest

# Run with coverage
pytest --cov=app --cov-report=html

# Run specific test file
pytest tests/test_tickets.py

# Run specific test
pytest tests/test_tickets.py::test_create_ticket
```

### TypeScript Tests

```bash
cd client

# Build (also runs type check)
npm run build

# Type check only
npm run type-check
```

## Submitting Changes

### Workflow

1. **Create a feature branch**

   ```bash
   git checkout -b feat/your-feature-name
   ```

   Branch naming conventions:
   - `feat/` - New features
   - `fix/` - Bug fixes
   - `docs/` - Documentation changes
   - `refactor/` - Code refactoring
   - `test/` - Test additions/changes
   - `chore/` - Maintenance tasks

2. **Make your changes**

   Write clean, well-documented code following the style guidelines.

3. **Test your changes**

   ```bash
   # Run Python tests
   cd server && pytest

   # Run TypeScript checks
   cd client && npm run type-check && npm run lint
   ```

4. **Run pre-commit checks (recommended)**

   Run pre-commit manually before committing:

   ```bash
   # Run all checks
   pre-commit run --all-files

   # Or format code directly
   cd server && black . && ruff check --fix .
   cd client && npm run format && npm run lint:fix
   ```

5. **Commit your changes**

   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

6. **Push your branch**

   ```bash
   git push origin feat/your-feature-name
   ```

7. **Create a Pull Request**

   - Go to GitHub and create a PR
   - Fill in the PR template
   - Ensure all CI checks pass
   - Request review from maintainers

## Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that don't affect code meaning (whitespace, formatting)
- **refactor**: Code change that neither fixes a bug nor adds a feature
- **perf**: Performance improvement
- **test**: Adding missing tests or correcting existing tests
- **build**: Changes to build system or dependencies
- **ci**: Changes to CI configuration files and scripts
- **chore**: Other changes that don't modify src or test files
- **revert**: Reverts a previous commit

### Examples

```bash
# Simple feature
git commit -m "feat: add tag filtering to tickets"

# Bug fix with scope
git commit -m "fix(api): resolve CORS issue in production"

# Breaking change
git commit -m "feat!: redesign ticket API

BREAKING CHANGE: The ticket API now uses a different schema."

# Multiple paragraphs
git commit -m "refactor: restructure ticket service

- Extract validation logic to separate module
- Improve error handling
- Add more comprehensive tests

Closes #123"
```

### Commit Message Rules

1. Use the imperative mood ("add" not "added" or "adds")
2. Don't capitalize the first letter of the description
3. No period at the end of the description
4. Separate subject from body with a blank line
5. Wrap body at 72 characters
6. Use body to explain **what** and **why**, not **how**

## Pull Request Guidelines

### PR Title

PR titles must follow the same format as commit messages:

```
<type>[optional scope]: <description>
```

### PR Description

Use the PR template and include:

1. **Summary**: What changes does this PR introduce?
2. **Motivation**: Why are these changes needed?
3. **Testing**: How were these changes tested?
4. **Screenshots**: For UI changes (if applicable)
5. **Related Issues**: Link related issues (e.g., "Closes #123")

### PR Checklist

Before submitting:

- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated (if needed)
- [ ] Tests added/updated
- [ ] All tests pass
- [ ] Pre-commit hooks pass
- [ ] No new warnings introduced

## Code Review Process

1. **Automated Checks**: CI must pass (pre-commit, tests, build)
2. **Peer Review**: At least one approval from a maintainer
3. **Changes Requested**: Address feedback and push updates
4. **Approval**: Once approved, maintainers will merge

## Questions?

If you have questions:

1. Check existing documentation
2. Search existing issues
3. Create a new issue with the `question` label

## License

By contributing, you agree that your contributions will be licensed under the same
license as the project.

Thank you for contributing! 🎉
