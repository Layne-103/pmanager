# Manual Pre-commit Workflow

## Overview

Pre-commit is configured to run **MANUALLY** in this project. This gives you full control over
when to run code quality checks, rather than having them run automatically on every commit.

## Why Manual?

- ✅ **Flexibility**: Run checks when you're ready
- ✅ **Speed**: Commit quickly, run checks on your schedule
- ✅ **Control**: Choose which checks to run and when
- ✅ **Learning**: Understand what checks are running

CI will still run all checks on push/PR, so code quality is maintained.

## Daily Workflow

### Recommended Workflow

```bash
# 1. Make your changes
vim some_file.py
vim other_file.tsx

# 2. Stage your changes
git add .

# 3. Run pre-commit manually (recommended before committing)
pre-commit run --all-files

# 4. Review results and fix any issues
# Auto-fixed files will need to be staged again
git add .

# 5. Commit
git commit -m "feat: add new feature"

# 6. Push
git push
```

### Quick Format (Alternative)

If you prefer to format code directly without pre-commit:

```bash
# Python
cd server
black .
ruff check --fix .
isort .

# TypeScript
cd client
npm run format
npm run lint:fix

# Then commit
git add .
git commit -m "feat: add new feature"
```

## Common Commands

### Run All Checks

```bash
# Run on all files (recommended before committing)
pre-commit run --all-files

# Run on staged files only
pre-commit run
```

### Run Specific Checks

```bash
# Python
pre-commit run black --all-files
pre-commit run ruff --all-files
pre-commit run mypy --all-files

# TypeScript
pre-commit run eslint --all-files
pre-commit run prettier --all-files

# Other
pre-commit run check-yaml --all-files
pre-commit run check-json --all-files
```

### Direct Formatting

```bash
# Python
cd server && black . && ruff check --fix . && isort .

# TypeScript
cd client && npm run format && npm run lint:fix

# Type checking
cd server && mypy app/
cd client && npm run type-check
```

## When to Run Pre-commit

### Before Committing (Recommended)

Run pre-commit before every commit to catch issues early:

```bash
pre-commit run --all-files
git commit -m "feat: add feature"
```

### Periodically During Development

Run checks while coding to get immediate feedback:

```bash
# After making several changes
pre-commit run --all-files
```

### Before Pushing

Always run before pushing to ensure CI will pass:

```bash
pre-commit run --all-files
git push
```

### Before Creating a PR

Run full checks before opening a pull request:

```bash
pre-commit run --all-files
# Run tests
cd server && pytest
cd client && npm run type-check && npm run build
```

## Optional: Install Automatic Hooks

If you prefer hooks to run automatically on every commit:

### Install

```bash
pre-commit install
pre-commit install --hook-type commit-msg
```

Now hooks run automatically:

```bash
git add .
git commit -m "feat: add feature"  # Hooks run automatically
```

### Uninstall

Return to manual mode:

```bash
pre-commit uninstall
pre-commit uninstall --hook-type commit-msg
```

## Handling Check Failures

### Scenario 1: Auto-Fixed Issues

Some checks automatically fix issues (Black, Prettier, etc.):

```bash
$ pre-commit run --all-files
black....................................Fixed

# Files were modified, stage them and run again
$ git add .
$ pre-commit run --all-files
black....................................Passed
```

### Scenario 2: Manual Fixes Needed

Some checks require manual fixes:

```bash
$ pre-commit run --all-files
ruff.....................................Failed
- exit code: 1

server/app/main.py:10:1: F401 'os' imported but unused

# Fix the issue manually
$ vim server/app/main.py  # Remove unused import

# Stage and run again
$ git add server/app/main.py
$ pre-commit run --all-files
ruff.....................................Passed
```

### Scenario 3: Type Check Errors

```bash
$ pre-commit run --all-files
mypy.....................................Failed

server/app/main.py:15: error: Argument 1 has incompatible type

# Fix the type error
$ vim server/app/main.py

# Run again
$ pre-commit run --all-files
mypy.....................................Passed
```

## Tips & Best Practices

### 1. Run Checks Frequently

Don't wait until you're ready to commit. Run checks frequently:

```bash
# After implementing a feature
pre-commit run --all-files

# After refactoring
pre-commit run --all-files
```

### 2. Use Format Scripts

For quick formatting without full pre-commit:

```bash
# Python: Quick format
cd server && black . && ruff check --fix .

# TypeScript: Quick format
cd client && npm run format
```

### 3. Check Specific Files

Run checks on specific files for faster feedback:

```bash
# Check specific files
pre-commit run --files server/app/main.py

# Check files matching pattern
pre-commit run --files server/app/*.py
```

### 4. Use Verbose Mode

See detailed output when debugging:

```bash
pre-commit run --all-files --verbose
```

### 5. Keep Hooks Updated

Update hooks regularly:

```bash
pre-commit autoupdate
```

## CI Integration

Even though hooks run manually locally, they still run automatically in CI:

- ✅ Every push triggers pre-commit in GitHub Actions
- ✅ Every PR runs full pre-commit checks
- ✅ CI failures will block merging

So it's best to run pre-commit locally first to catch issues early!

## Comparison: Manual vs Automatic

### Manual Mode (Current Setup)

**Pros:**
- ✅ Commit quickly without waiting
- ✅ Run checks on your schedule
- ✅ Choose when to format
- ✅ No interruptions during rapid commits

**Cons:**
- ⚠️ Must remember to run checks
- ⚠️ Might push code with issues (CI will catch)

**Best for:**
- Experienced developers
- Rapid prototyping
- Flexible workflows

### Automatic Mode (Optional)

**Pros:**
- ✅ Never forget to run checks
- ✅ Catch issues immediately
- ✅ Consistent enforcement

**Cons:**
- ⚠️ Slower commits (waits for checks)
- ⚠️ Can be annoying during rapid iteration
- ⚠️ Interrupts flow

**Best for:**
- Teams wanting enforcement
- Ensuring consistency
- Learning code quality

## Quick Reference Card

```bash
# Setup (one-time)
pip install pre-commit

# Daily workflow
git add .                          # Stage changes
pre-commit run --all-files         # Run checks
git commit -m "feat: add feature"  # Commit

# Common commands
pre-commit run --all-files         # Run all checks
pre-commit run black --all-files   # Run specific hook
pre-commit autoupdate              # Update hooks

# Format directly
cd server && black . && ruff check --fix .
cd client && npm run format && npm run lint:fix

# Optional: Install automatic hooks
pre-commit install                 # Enable automatic mode
pre-commit uninstall              # Return to manual mode
```

## Getting Help

- Full docs: `docs/PRE_COMMIT_SETUP.md`
- Quick start: `QUICK_START_PRECOMMIT.md`
- Contributing: `CONTRIBUTING.md`

## Summary

Pre-commit runs **manually** in this project. Run `pre-commit run --all-files` before
committing to ensure code quality. CI will still enforce all checks on push/PR.

This gives you flexibility while maintaining code quality! 🚀
