#!/bin/bash
# Pre-commit setup script for pmanager project

set -e  # Exit on error

echo "🚀 Setting up pre-commit hooks for pmanager..."
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f ".pre-commit-config.yaml" ]; then
    echo -e "${RED}❌ Error: .pre-commit-config.yaml not found${NC}"
    echo "Please run this script from the project root directory"
    exit 1
fi

echo "📍 Current directory: $(pwd)"
echo ""

# Function to print status
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC}  $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Check Python version
echo "🐍 Checking Python version..."
PYTHON_VERSION=$(python3 --version 2>&1 | awk '{print $2}')
print_status "Python version: $PYTHON_VERSION"
echo ""

# Check Node version
echo "📦 Checking Node.js version..."
NODE_VERSION=$(node --version 2>&1)
print_status "Node.js version: $NODE_VERSION"
echo ""

# Install pre-commit
echo "📥 Installing pre-commit..."
if command -v pre-commit &> /dev/null; then
    print_status "pre-commit is already installed"
else
    pip3 install pre-commit
    print_status "pre-commit installed successfully"
fi
echo ""

# Install git hooks
echo "🔗 Installing git hooks..."
pre-commit install
pre-commit install --hook-type commit-msg
print_status "Git hooks installed"
echo ""

# Install Python development dependencies
echo "🐍 Installing Python development dependencies..."
cd server
if [ -f "requirements.txt" ]; then
    pip3 install -r requirements.txt
    pip3 install black ruff mypy isort pytest pytest-cov
    print_status "Python dependencies installed"
else
    print_warning "requirements.txt not found in server/"
fi
cd ..
echo ""

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd client
if [ -f "package.json" ]; then
    npm install
    print_status "Frontend dependencies installed"
else
    print_warning "package.json not found in client/"
fi
cd ..
echo ""

# Run pre-commit on all files (optional)
echo "🔍 Running pre-commit checks on all files..."
echo "This may take a few minutes on first run..."
if pre-commit run --all-files; then
    print_status "All pre-commit checks passed!"
else
    print_warning "Some checks failed. Review the output above."
    echo "Don't worry - pre-commit will auto-fix most issues."
    echo "Run 'pre-commit run --all-files' again after fixes."
fi
echo ""

# Print summary
echo "════════════════════════════════════════════════════════════"
echo "✅ Pre-commit setup complete!"
echo "════════════════════════════════════════════════════════════"
echo ""
echo "📚 Next steps:"
echo "  1. Make changes to your code"
echo "  2. Run: git add ."
echo "  3. Run: git commit -m 'your message'"
echo "  4. Pre-commit hooks will run automatically!"
echo ""
echo "💡 Useful commands:"
echo "  • Run all hooks:     pre-commit run --all-files"
echo "  • Update hooks:      pre-commit autoupdate"
echo "  • Skip hooks (rare): git commit --no-verify"
echo ""
echo "📖 Read PRE_COMMIT_SETUP.md for detailed documentation"
echo ""
echo "Happy coding! 🎉"
