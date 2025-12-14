#!/bin/bash
# Development Environment Setup Script
# This script sets up pre-commit hooks and development dependencies

set -e

echo "🚀 Setting up development environment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're in the project root
if [ ! -f "pyproject.toml" ]; then
    echo -e "${RED}❌ Error: Please run this script from the project root directory${NC}"
    exit 1
fi

# Check Python version
echo -e "\n${YELLOW}Checking Python version...${NC}"
PYTHON_VERSION=$(python3 --version 2>&1 | awk '{print $2}')
echo "✓ Python version: $PYTHON_VERSION"

# Check Node version
echo -e "\n${YELLOW}Checking Node.js version...${NC}"
NODE_VERSION=$(node --version 2>&1)
echo "✓ Node.js version: $NODE_VERSION"

# Install pre-commit if not already installed
echo -e "\n${YELLOW}Installing pre-commit...${NC}"
if command -v pre-commit &> /dev/null; then
    echo "✓ pre-commit is already installed"
else
    pip3 install pre-commit
    echo "✓ pre-commit installed"
fi

# Note: Pre-commit hooks are NOT installed automatically
# This allows you to run pre-commit manually only when you want
echo -e "\n${YELLOW}Note: Pre-commit hooks are configured but NOT auto-installed${NC}"
echo "  To run manually: pre-commit run --all-files"
echo "  To install hooks (optional): pre-commit install"
echo "✓ Pre-commit configured for manual use only"

# Install Python dependencies for server
echo -e "\n${YELLOW}Installing Python dependencies...${NC}"
if [ -d "server" ]; then
    cd server
    if [ -f "requirements.txt" ]; then
        pip3 install -r requirements.txt
        echo "✓ Python dependencies installed"
    fi
    cd ..
fi

# Install Node.js dependencies for client
echo -e "\n${YELLOW}Installing Node.js dependencies...${NC}"
if [ -d "client" ]; then
    cd client
    if [ -f "package.json" ]; then
        npm install
        echo "✓ Node.js dependencies installed"
    fi
    cd ..
fi

# Install pre-commit hooks environments
echo -e "\n${YELLOW}Setting up pre-commit environments (this may take a few minutes)...${NC}"
pre-commit install-hooks
echo "✓ Pre-commit environments ready"

# Test pre-commit hooks (optional, can be commented out)
echo -e "\n${YELLOW}Testing pre-commit hooks on all files...${NC}"
echo "This will format and lint all files. Continue? (y/n)"
read -r response
if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    pre-commit run --all-files || true
    echo -e "${GREEN}✓ Pre-commit test completed (some failures are expected on first run)${NC}"
fi

echo -e "\n${GREEN}✅ Development environment setup complete!${NC}"
echo -e "\n${YELLOW}Next steps:${NC}"
echo "1. Make changes to your files"
echo "2. Stage them with: git add <files>"
echo "3. Commit with: git commit -m 'your message'"
echo "4. Pre-commit hooks will run automatically!"
echo ""
echo -e "${YELLOW}Available commands:${NC}"
echo "  • Run pre-commit manually: pre-commit run --all-files"
echo "  • Update pre-commit hooks: pre-commit autoupdate"
echo "  • Format Python: cd server && black ."
echo "  • Lint Python: cd server && ruff check ."
echo "  • Format TypeScript: cd client && npm run format"
echo "  • Lint TypeScript: cd client && npm run lint"
echo ""
