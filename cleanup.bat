@echo off
REM Cleanup script for Windows

echo.
echo 🧹 Cleaning up Food App...
echo ==============================

REM Stop Docker containers
echo Stopping Docker containers...
docker-compose down

REM Ask to remove Docker images
set /p REMOVE_IMAGES="Remove Docker images? (y/n): "
if /i "%REMOVE_IMAGES%"=="y" (
    echo Removing Docker images...
    docker rmi food-app:latest
    docker rmi node:18-alpine
    docker rmi mongo:6.0-alpine
)

REM Ask to remove node_modules
set /p REMOVE_MODULES="Remove node_modules? (y/n): "
if /i "%REMOVE_MODULES%"=="y" (
    echo Removing node_modules...
    if exist "node_modules" rmdir /s /q node_modules
    if exist "package-lock.json" del package-lock.json
)

REM Remove build artifacts
echo Removing build artifacts...
if exist "dist" rmdir /s /q dist
if exist "coverage" rmdir /s /q coverage
if exist ".next" rmdir /s /q .next

REM Ask to prune Docker
set /p PRUNE_DOCKER="Prune Docker system? (y/n): "
if /i "%PRUNE_DOCKER%"=="y" (
    echo Pruning Docker system...
    docker system prune -f
)

echo.
echo ✓ Cleanup completed!
echo ==============================

pause
