@echo off
setlocal enabledelayedexpansion

echo.
echo ========================================
echo 🛠️  Food App - Lightweight DevOps Tool
echo ========================================
echo.

:menu
echo [1] Start Jenkins (Minimal)
echo [2] Deploy to Kubernetes (Local)
echo [3] Stop All DevOps Services
echo [4] Exit
echo.
set /p choice="Choose an option [1-4]: "

if "%choice%"=="1" goto start_jenkins
if "%choice%"=="2" goto deploy_k8s
if "%choice%"=="3" goto stop_all
if "%choice%"=="4" exit /b

:start_jenkins
echo.
echo 🚀 Starting Jenkins...
docker-compose -f docker-compose.jenkins.yml up -d
if errorlevel 1 (
    echo ❌ Failed to start Jenkins. Make sure Docker is running.
) else (
    echo ✓ Jenkins is starting at http://localhost:8080
    echo Note: Initial password can be found in Jenkins logs.
    echo Run: docker logs jenkins-minimal
)
pause
goto menu

:deploy_k8s
echo.
echo 📦 Building and Deploying to Kubernetes...
echo Building image...
docker build -t food-app:latest .
echo Applying manifests...
kubectl apply -k k8s
if errorlevel 1 (
    echo ❌ Kubernetes deployment failed.
) else (
    echo ✓ Successfully applied to Kubernetes.
    echo To access, run: kubectl port-forward svc/food-app 5173:80
)
pause
goto menu

:stop_all
echo.
echo 🧹 Stopping all services...
docker-compose -f docker-compose.jenkins.yml down
kubectl delete -k k8s
echo ✓ Services stopped and resources cleaned.
pause
goto menu
