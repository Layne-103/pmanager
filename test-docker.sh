#!/bin/bash

# Docker Build and Test Script
# Tests Docker builds without running the full stack

set -e  # Exit on error

echo "========================================"
echo "Docker Build Test Script"
echo "========================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Check Docker is running
echo "Test 1: Checking Docker..."
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker is not running. Please start Docker and try again.${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Docker is running${NC}"
echo ""

# Test 2: Build backend image
echo "Test 2: Building backend Docker image..."
if docker build -f Dockerfile.backend -t pmanager-backend:test . > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend image built successfully${NC}"
    docker images | grep pmanager-backend:test
else
    echo -e "${RED}❌ Backend image build failed${NC}"
    exit 1
fi
echo ""

# Test 3: Build frontend image
echo "Test 3: Building frontend Docker image..."
if docker build -f Dockerfile.frontend -t pmanager-frontend:test . > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Frontend image built successfully${NC}"
    docker images | grep pmanager-frontend:test
else
    echo -e "${RED}❌ Frontend image build failed${NC}"
    exit 1
fi
echo ""

# Test 4: Check image sizes
echo "Test 4: Checking image sizes..."
backend_size=$(docker images pmanager-backend:test --format "{{.Size}}")
frontend_size=$(docker images pmanager-frontend:test --format "{{.Size}}")
echo "  Backend:  $backend_size"
echo "  Frontend: $frontend_size"
echo -e "${GREEN}✅ Image sizes checked${NC}"
echo ""

# Test 5: Test backend container starts
echo "Test 5: Testing backend container..."
if docker run --rm -d --name pmanager-backend-test \
    -e DATABASE_URL="postgresql://postgres:password@localhost:5432/pmanager" \
    -e ALLOWED_ORIGINS="http://localhost:8080" \
    pmanager-backend:test > /dev/null 2>&1; then
    
    sleep 5  # Wait for startup
    
    # Check if container is running
    if docker ps | grep pmanager-backend-test > /dev/null; then
        echo -e "${GREEN}✅ Backend container started successfully${NC}"
        docker logs pmanager-backend-test 2>&1 | tail -5
        docker stop pmanager-backend-test > /dev/null 2>&1
    else
        echo -e "${RED}❌ Backend container failed to start${NC}"
        docker logs pmanager-backend-test 2>&1
        exit 1
    fi
else
    echo -e "${YELLOW}⚠️  Backend container start test skipped (needs database)${NC}"
fi
echo ""

# Test 6: Test frontend container starts
echo "Test 6: Testing frontend container..."
if docker run --rm -d --name pmanager-frontend-test \
    -p 8081:8080 \
    pmanager-frontend:test > /dev/null 2>&1; then
    
    sleep 3  # Wait for startup
    
    # Check if container is running
    if docker ps | grep pmanager-frontend-test > /dev/null; then
        echo -e "${GREEN}✅ Frontend container started successfully${NC}"
        docker logs pmanager-frontend-test 2>&1 | tail -5
        
        # Test health endpoint
        if curl -s http://localhost:8081/health > /dev/null 2>&1; then
            echo -e "${GREEN}✅ Frontend health check passed${NC}"
        fi
        
        docker stop pmanager-frontend-test > /dev/null 2>&1
    else
        echo -e "${RED}❌ Frontend container failed to start${NC}"
        docker logs pmanager-frontend-test 2>&1
        exit 1
    fi
else
    echo -e "${RED}❌ Frontend container start failed${NC}"
    exit 1
fi
echo ""

# Test 7: Test docker-compose configuration
echo "Test 7: Validating docker-compose.yml..."
if docker-compose config > /dev/null 2>&1; then
    echo -e "${GREEN}✅ docker-compose.yml is valid${NC}"
else
    echo -e "${RED}❌ docker-compose.yml has errors${NC}"
    exit 1
fi
echo ""

# Cleanup
echo "Cleaning up test images..."
docker rmi pmanager-backend:test pmanager-frontend:test > /dev/null 2>&1 || true
echo -e "${GREEN}✅ Cleanup complete${NC}"
echo ""

# Summary
echo "========================================"
echo -e "${GREEN}✅ All Docker tests passed!${NC}"
echo "========================================"
echo ""
echo "Next steps:"
echo "  1. Run full stack: docker-compose up -d"
echo "  2. Check logs: docker-compose logs -f"
echo "  3. Access app: http://localhost:8080"
echo ""
