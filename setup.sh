#!/bin/bash

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🚀 Food App DevOps Setup${NC}"
echo "=================================="

# Check Docker
echo -e "\n${YELLOW}Checking Docker...${NC}"
if command -v docker &> /dev/null; then
    echo -e "${GREEN}✓ Docker is installed${NC}"
    docker --version
else
    echo -e "${RED}✗ Docker is not installed${NC}"
    exit 1
fi

# Check Docker Compose
echo -e "\n${YELLOW}Checking Docker Compose...${NC}"
if command -v docker-compose &> /dev/null; then
    echo -e "${GREEN}✓ Docker Compose is installed${NC}"
    docker-compose --version
else
    echo -e "${RED}✗ Docker Compose is not installed${NC}"
    exit 1
fi

# Check Node.js
echo -e "\n${YELLOW}Checking Node.js...${NC}"
if command -v node &> /dev/null; then
    echo -e "${GREEN}✓ Node.js is installed${NC}"
    node --version
    npm --version
else
    echo -e "${RED}✗ Node.js is not installed${NC}"
    exit 1
fi

# Install npm dependencies
echo -e "\n${YELLOW}Installing npm dependencies...${NC}"
npm install --legacy-peer-deps

# Build Docker image
echo -e "\n${YELLOW}Building Docker image...${NC}"
docker build -t food-app:latest .

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Docker image built successfully${NC}"
else
    echo -e "${RED}✗ Docker build failed${NC}"
    exit 1
fi

# Start services
echo -e "\n${YELLOW}Starting Docker services...${NC}"
docker-compose up -d

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Docker services started${NC}"
else
    echo -e "${RED}✗ Failed to start Docker services${NC}"
    exit 1
fi

# Wait for services to be ready
echo -e "\n${YELLOW}Waiting for services to be ready...${NC}"
sleep 10

# Health check
echo -e "\n${YELLOW}Performing health checks...${NC}"
if curl -f http://localhost:5173 > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Frontend is healthy${NC}"
else
    echo -e "${RED}✗ Frontend health check failed${NC}"
fi

# Show running services
echo -e "\n${YELLOW}Running services:${NC}"
docker-compose ps

echo -e "\n${GREEN}=================================="
echo "✓ Setup completed successfully!"
echo -e "==================================\n"

echo "Access your application:"
echo -e "  Frontend: ${GREEN}http://localhost:5173${NC}"
echo -e "  API Server: ${GREEN}http://localhost:3000${NC}"
echo -e "  Database: ${GREEN}mongodb://admin:password@localhost:27017${NC}"

echo -e "\nUseful commands:"
echo -e "  View logs: ${YELLOW}docker-compose logs -f${NC}"
echo -e "  Stop services: ${YELLOW}docker-compose down${NC}"
echo -e "  Rebuild: ${YELLOW}docker-compose up -d --build${NC}"

echo ""
