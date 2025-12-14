# Pre-commit and CI/CD Setup Guide

## Overview
This project uses **pre-commit hooks** for code quality checks and **GitHub Actions** for continuous integration and deployment.

## Pre-commit Hooks

### What is Pre-commit?
Pre-commit is a framework for managing git hook scripts. It runs automated checks before each commit to ensure code quality.

### Installed Hooks

#### General Hooks
- ✅ **trailing-whitespace**: Remove trailing whitespace
- ✅ **end-of-file-fixer**: Ensure files end with newline
- ✅ **check-yaml**: Validate YAML syntax
- ✅ **check-json**: Validate JSON syntax
- ✅ **check-added-large-files**: Prevent large files (>1MB)
- ✅ **check-merge-conflict**: Detect merge conflict markers
- ✅ **detect-private-key**: Prevent committing private keys
- ✅ **mixed-line-ending**: Enforce LF line endings

#### Python Hooks (server/)
- ✅ **black**: Code formatter (line-length=100)
- ✅ **ruff**: Fast Python linter
- ✅ **mypy**: Static type checker
- ✅ **isort**: Import sorter

#### TypeScript/JavaScript Hooks (client/)
- ✅ **eslint**: TypeScript/JavaScript linter
- ✅ **prettier**: Code formatter
- ✅ **typescript**: Type checking

#### Other
- ✅ **markdownlint**: Markdown linter
- ✅ **shellcheck**: Shell script linter
- ✅ **gitlint**: Git commit message linter

## Installation

### 1. Install Pre-commit

```bash
# Using pip
pip install pre-commit

# Or using homebrew (macOS)
brew install pre-commit
```

### 2. Install Git Hooks

```bash
cd /Users/jianglin.guo/pmanager
pre-commit install
pre-commit install --hook-type commit-msg
```

### 3. Install Backend Dependencies

```bash
cd server
pip install -r requirements.txt
pip install black ruff mypy isort pytest pytest-cov
```

### 4. Install Frontend Dependencies

```bash
cd client
npm install
```

## Usage

### Automatic Checks (on commit)

When you run `git commit`, pre-commit will automatically:

1. Format Python code with Black
2. Lint Python code with Ruff
3. Check Python types with MyPy
4. Sort Python imports with isort
5. Lint TypeScript/JavaScript with ESLint
6. Format TypeScript/JavaScript with Prettier
7. Run other checks

```bash
git add .
git commit -m "feat: add new feature"
# Pre-commit runs automatically here ✅
```

### Manual Run

Run all hooks on all files:

```bash
pre-commit run --all-files
```

Run specific hook:

```bash
pre-commit run black --all-files
pre-commit run eslint --all-files
pre-commit run prettier --all-files
```

### Skip Hooks (Not Recommended)

If absolutely necessary:

```bash
git commit --no-verify -m "message"
```

## Configuration Files

### Pre-commit
- **`.pre-commit-config.yaml`**: Main configuration
- **`pyproject.toml`**: Python tools configuration (black, ruff, mypy, isort)
- **`.prettierrc`**: Prettier configuration
- **`.prettierignore`**: Prettier ignore patterns
- **`.markdownlint.json`**: Markdown lint rules

## GitHub Actions Workflows

### 1. CI Workflow (`.github/workflows/ci.yml`)

**Triggers**: Push and PR to `main` or `develop`

**Jobs**:
- ✅ **pre-commit**: Run all pre-commit hooks
- ✅ **backend**: Test Python code on 3.11, 3.12, 3.13
  - Black formatting check
  - Ruff linting
  - MyPy type checking
  - Pytest with coverage
- ✅ **frontend**: Test TypeScript on Node 20, 22
  - ESLint
  - Prettier check
  - TypeScript check
  - Build
- ✅ **security**: Trivy vulnerability scan

### 2. Deploy Workflow (`.github/workflows/deploy.yml`)

**Triggers**: Push to `main` or tag `v*`

**Jobs**:
- Build frontend
- Test backend
- Create release (for tags)
- Deploy notification

### 3. PR Checks (`.github/workflows/pr-checks.yml`)

**Triggers**: Pull request events

**Jobs**:
- ✅ PR title format check (conventional commits)
- ✅ Bundle size check
- ✅ Dependency audit
- ✅ Auto-label PRs

### 4. Dependabot (`.github/dependabot.yml`)

Automatic dependency updates:
- Weekly npm updates (frontend)
- Weekly pip updates (backend)
- Monthly GitHub Actions updates

## Code Quality Standards

### Python (Backend)

#### Formatting
```python
# Line length: 100 characters
# Use Black for formatting
def my_function(param1: str, param2: int) -> bool:
    return True
```

#### Linting
```python
# Ruff enforces:
# - PEP 8 style
# - Import ordering
# - No unused imports
# - No undefined variables
# - Security checks (bandit)
```

#### Type Hints
```python
# Use type hints for functions
def get_user(user_id: int) -> Optional[User]:
    return db.query(User).filter(User.id == user_id).first()
```

### TypeScript/JavaScript (Frontend)

#### Formatting
```typescript
// Prettier settings:
// - Print width: 100
// - Single quotes
// - Trailing commas: es5
// - Tab width: 2

const myFunction = (param1: string, param2: number): boolean => {
  return true;
};
```

#### Linting
```typescript
// ESLint enforces:
// - TypeScript best practices
// - React hooks rules
// - No unused variables
// - Consistent code style
```

## Commit Message Format

Use **Conventional Commits**:

```bash
type(scope): subject

body (optional)

footer (optional)
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructuring
- `perf`: Performance improvement
- `test`: Tests
- `build`: Build system
- `ci`: CI configuration
- `chore`: Maintenance

**Examples**:
```bash
feat(auth): add JWT authentication
fix(api): resolve CORS issue
docs(readme): update installation guide
style(frontend): format with prettier
refactor(backend): simplify database queries
test(api): add integration tests
```

## Troubleshooting

### Pre-commit Hook Failed

```bash
# View what failed
git status

# Fix issues automatically (if possible)
pre-commit run --all-files

# Manually fix remaining issues
# Then commit again
```

### Skip Specific File

Add to `.pre-commit-config.yaml`:

```yaml
- id: black
  exclude: ^path/to/file\.py$
```

### Update Hooks

```bash
pre-commit autoupdate
```

### Clear Cache

```bash
pre-commit clean
```

## CI/CD Status Badges

Add to README.md:

```markdown
![CI](https://github.com/username/pmanager/workflows/CI/badge.svg)
![Deploy](https://github.com/username/pmanager/workflows/Deploy/badge.svg)
![pre-commit](https://img.shields.io/badge/pre--commit-enabled-brightgreen?logo=pre-commit)
```

## Best Practices

### 1. Run Pre-commit Before Pushing
```bash
pre-commit run --all-files
git push
```

### 2. Keep Dependencies Updated
```bash
# Update pre-commit hooks
pre-commit autoupdate

# Update Python dependencies
pip list --outdated

# Update npm dependencies
npm outdated
```

### 3. Review CI Failures
- Check GitHub Actions tab
- Read error messages
- Fix locally and push again

### 4. Use Type Hints
```python
# Good
def calculate(x: int, y: int) -> int:
    return x + y

# Bad
def calculate(x, y):
    return x + y
```

### 5. Write Tests
```python
# Backend
def test_create_ticket():
    response = client.post("/api/tickets/", json={"title": "Test"})
    assert response.status_code == 201
```

## Performance Tips

### 1. Skip Slow Hooks in Development
```yaml
# .pre-commit-config.yaml
- id: mypy
  stages: [push]  # Only run on git push
```

### 2. Use File Patterns
```yaml
- id: black
  files: ^server/app/.*\.py$  # Only app files
```

### 3. Parallel Execution
Pre-commit runs hooks in parallel by default for speed.

## Integration with IDEs

### VS Code

Install extensions:
- **Python**: ms-python.python
- **Pylance**: ms-python.vscode-pylance
- **ESLint**: dbaeumer.vscode-eslint
- **Prettier**: esbenp.prettier-vscode

Settings:
```json
{
  "python.linting.enabled": true,
  "python.linting.ruffEnabled": true,
  "python.formatting.provider": "black",
  "editor.formatOnSave": true,
  "[python]": {
    "editor.defaultFormatter": "ms-python.black-formatter"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

### PyCharm

- Enable Black formatter
- Enable Ruff linter
- Enable MyPy
- Enable ESLint
- Enable Prettier

## Summary

✅ **Pre-commit hooks**: Automatic code quality checks
✅ **GitHub Actions**: CI/CD pipelines
✅ **Code formatting**: Black (Python), Prettier (TS/JS)
✅ **Linting**: Ruff (Python), ESLint (TS/JS)
✅ **Type checking**: MyPy (Python), TypeScript
✅ **Testing**: Pytest (Python), automated builds
✅ **Security**: Trivy scanning, dependency audits
✅ **Documentation**: Comprehensive setup guide

Your code quality is now automated! 🚀
