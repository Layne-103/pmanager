# Pre-commit Setup Guide

This guide explains how to set up and use pre-commit hooks in this project.

## What is Pre-commit?

Pre-commit is a framework for managing code quality checks. In this project, pre-commit is
configured to run **MANUALLY** (not automatically on commit), giving you control over when
to run code quality checks.

## Quick Setup

### Automated Setup (Recommended)

Run the automated setup script from the project root:

```bash
./setup-dev.sh
```

This will:
- Install pre-commit
- Set up all pre-commit hooks
- Install Python and Node.js dependencies
- Configure hook environments

### Manual Setup

If you prefer manual setup:

```bash
# Install pre-commit
pip install pre-commit

# Note: Hooks are NOT installed automatically
# Pre-commit will run manually only when you choose

# Optional: Install automatic hooks (if you want them to run on commit)
# pre-commit install
# pre-commit install --hook-type commit-msg

# Install hook environments (takes a few minutes)
pre-commit install-hooks
```

## What Gets Checked

### General Checks (All Files)

- ✅ Trailing whitespace removal
- ✅ End-of-file fixer
- ✅ YAML/JSON/TOML syntax validation
- ✅ Large file detection (>1MB)
- ✅ Private key detection
- ✅ Merge conflict markers
- ✅ Executable file shebangs

### Python Checks (server/)

- ✅ **Black**: Code formatting (line length: 100)
- ✅ **Ruff**: Fast linting and auto-fixing
- ✅ **isort**: Import statement sorting
- ✅ **mypy**: Static type checking

### TypeScript/JavaScript Checks (client/)

- ✅ **ESLint**: Code linting with auto-fix
- ✅ **Prettier**: Code formatting

### Other Checks

- ✅ **Markdownlint**: Markdown file linting
- ✅ **Shellcheck**: Shell script validation
- ✅ **Gitlint**: Commit message format validation

## Usage

### Manual Execution (Default)

By default, pre-commit runs **MANUALLY** only when you choose:

```bash
# Make your changes
git add .

# Run pre-commit manually (recommended before committing)
pre-commit run --all-files

# If checks pass, commit
git commit -m "feat: add new feature"
```

If checks fail:
1. Pre-commit will show you the errors
2. Some issues are auto-fixed (you'll need to stage again)
3. Fix remaining issues manually
4. Run pre-commit again and commit

### Optional: Automatic Execution

If you want hooks to run automatically on every commit:

```bash
pre-commit install
pre-commit install --hook-type commit-msg
```

Then hooks will run automatically:

```bash
git add .
git commit -m "feat: add new feature"  # Hooks run automatically
```

To uninstall automatic hooks:

```bash
pre-commit uninstall
pre-commit uninstall --hook-type commit-msg
```

### Manual Execution

Run pre-commit manually on staged files:

```bash
pre-commit run
```

Run on all files in the repository:

```bash
pre-commit run --all-files
```

Run a specific hook:

```bash
pre-commit run black --all-files
pre-commit run eslint --all-files
```

### Updating Hooks

Keep hooks up to date with latest versions:

```bash
pre-commit autoupdate
```

This updates the hook versions in `.pre-commit-config.yaml`.

## Common Workflows

### Starting Work on a New Feature

```bash
# Create a new branch
git checkout -b feat/my-feature

# Make your changes
# ...

# Stage your changes
git add .

# Run pre-commit manually (recommended)
pre-commit run --all-files

# Commit
git commit -m "feat: add my feature"
```

### Fixing Pre-commit Failures

**Scenario 1: Auto-fixed issues**

```bash
$ git commit -m "feat: add feature"
black....................................Failed
- hook id: black
- files were modified by this hook

# Files were auto-formatted, stage them and commit again
$ git add .
$ git commit -m "feat: add feature"
```

**Scenario 2: Manual fixes needed**

```bash
$ git commit -m "feat: add feature"
ruff.....................................Failed
- hook id: ruff
- exit code: 1

server/app/main.py:10:1: F401 'os' imported but unused

# Fix the issues manually
$ vim server/app/main.py  # Remove unused import

# Stage and commit again
$ git add server/app/main.py
$ git commit -m "feat: add feature"
```

### Installing/Uninstalling Automatic Hooks

```bash
# Install automatic hooks (optional)
pre-commit install
pre-commit install --hook-type commit-msg

# Uninstall automatic hooks
pre-commit uninstall
pre-commit uninstall --hook-type commit-msg
```

**Note**: CI will still run all checks regardless of local hook installation.

## Troubleshooting

### Pre-commit is too slow

First run is slow because it sets up environments. Subsequent runs are fast.

### Hook fails but I can't see why

Run with verbose output:

```bash
pre-commit run --all-files --verbose
```

### I want to disable a specific hook temporarily

Edit `.pre-commit-config.yaml` and comment out the hook:

```yaml
# - repo: https://github.com/psf/black
#   rev: 24.10.0
#   hooks:
#     - id: black
```

Or skip it in CI config:

```yaml
ci:
  skip: [black]  # Skip black in pre-commit.ci
```

### Pre-commit cache is corrupted

Clean and reinstall:

```bash
pre-commit clean
pre-commit install-hooks
```

### Hook environment installation fails

Try installing in a fresh environment:

```bash
# Remove old environments
rm -rf ~/.cache/pre-commit

# Reinstall
pre-commit install-hooks
```

## Configuration Files

### `.pre-commit-config.yaml`

Main configuration file for all hooks. Contains:
- Hook repositories and versions
- Hook IDs and configurations
- File patterns to include/exclude
- Hook-specific arguments

### `pyproject.toml`

Python tool configurations:
- Black settings
- Ruff settings
- isort settings
- mypy settings
- pytest settings

### `.prettierrc`

Prettier formatting configuration for TypeScript/JavaScript.

### `eslint.config.js`

ESLint linting configuration for TypeScript/JavaScript.

### `.markdownlint.json`

Markdownlint configuration for Markdown files.

## CI Integration

Pre-commit also runs in CI (GitHub Actions):

### `.github/workflows/ci.yml`

The `pre-commit` job runs all hooks on every push and PR:

```yaml
jobs:
  pre-commit:
    name: Pre-commit Hooks
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.13'
      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      - name: Install pre-commit
        run: pip install pre-commit
      - name: Cache pre-commit hooks
        uses: actions/cache@v4
      - name: Run pre-commit
        run: pre-commit run --all-files --show-diff-on-failure
```

### Pre-commit.ci (Optional)

You can enable pre-commit.ci for automatic updates and fixes:

1. Go to https://pre-commit.ci
2. Sign in with GitHub
3. Enable for your repository

Configuration is already in `.pre-commit-config.yaml`:

```yaml
ci:
  autofix_commit_msg: |
    [pre-commit.ci] auto fixes from pre-commit hooks
  autofix_prs: true
  autoupdate_schedule: weekly
```

## Best Practices

1. **Run pre-commit early**: Don't wait until you're ready to commit. Run it periodically:
   ```bash
   pre-commit run --files $(git diff --name-only)
   ```

2. **Keep hooks updated**: Update weekly or monthly:
   ```bash
   pre-commit autoupdate
   ```

3. **Fix issues locally**: Don't rely on CI to catch issues. Run pre-commit locally first.

4. **Commit frequently**: Small commits are easier to fix if pre-commit fails.

5. **Read error messages**: Pre-commit provides helpful error messages and suggestions.

## Additional Resources

- [Pre-commit Documentation](https://pre-commit.com/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Contributing Guide](../CONTRIBUTING.md)
- [Black Documentation](https://black.readthedocs.io/)
- [Ruff Documentation](https://docs.astral.sh/ruff/)
- [ESLint Documentation](https://eslint.org/)
- [Prettier Documentation](https://prettier.io/)

## Getting Help

If you encounter issues:

1. Check this documentation
2. Run with `--verbose` flag for more details
3. Check the [troubleshooting](#troubleshooting) section
4. Search existing GitHub issues
5. Ask in team chat or create a GitHub issue
