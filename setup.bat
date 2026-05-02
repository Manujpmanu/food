@echo off
REM Color setup for Windows (requires Windows 10+)
setlocal enabledelayedexpansion

echo.
echo ========================================
echo 🚀 Food App DevOps Setup for Windows
echo ========================================

REM Check Docker
echo.
echo Checking Docker...
docker --version >nul 2>&1
if errorlevel 1 (
    echo ✗ Docker is not installed
    echo Please install Docker from https://www.docker.com/products/docker-desktop
    exit /b 1
)
echo ✓ Docker is installed
docker --version

REM Check Docker Compose
echo.
echo Checking Docker Compose...
docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo ✗ Docker Compose is not installed
    exit /b 1
)
echo ✓ Docker Compose is installed
docker-compose --version

REM Check Node.js
echo.
echo Checking Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ✗ Node.js is not installed
    echo Please install Node.js from https://nodejs.org
    exit /b 1
)
echo ✓ Node.js is installed
node --version
npm --version

REM Install dependencies
echo.
echo Installing npm dependencies...
call npm install --legacy-peer-deps
if errorlevel 1 (
    echo ✗ npm install failed
    exit /b 1
)

REM Build Docker image
echo.
echo Building Docker image...
docker build -t food-app:latest .
if errorlevel 1 (
    echo ✗ Docker build failed
    exit /b 1
)
echo ✓ Docker image built successfully

REM Start services
echo.
echo Starting Docker services...
docker-compose up -d
if errorlevel 1 (
    echo ✗ Failed to start Docker services
    exit /b 1
)
echo ✓ Docker services started

REM Wait for services
echo.
echo Waiting for services to be ready (10 seconds)...
timeout /t 10 /nobreak

REM Health check
echo.
echo Performing health checks...
curl -f http://localhost:5173 >nul 2>&1
if errorlevel 1 (
    echo ✗ Frontend health check failed
) else (
    echo ✓ Frontend is healthy
)

REM Show services
echo.
echo Running services:
docker-compose ps

echo.
echo ========================================
echo ✓ Setup completed successfully!
echo ========================================
echo.
echo Access your application:
echo   Frontend: http://localhost:5173
echo   API Server: http://localhost:3000
echo   Database: mongodb://admin:password@localhost:27017
echo.
echo Useful commands:
echo   View logs: docker-compose logs -f
echo   Stop services: docker-compose down
echo   Rebuild: docker-compose up -d --build
echo.

pause
