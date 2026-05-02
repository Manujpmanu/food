# Food App - CI/CD & DevOps Documentation

## Overview
This project includes complete CI/CD and DevOps setup with Docker, Jenkins, GitHub Actions, and code quality analysis.

## Architecture

```
┌─────────────────┐
│   Git Commit    │
└────────┬────────┘
         │
    ┌────▼─────┐
    │ GitHub   │
    │ Actions  │
    │ CI/CD    │
    └────┬─────┘
         │
    ┌────▼──────────────┐
    │  Build & Test     │
    │  - Lint           │
    │  - Test           │
    │  - SonarQube      │
    └────┬──────────────┘
         │
    ┌────▼─────┐
    │  Docker  │
    │  Build   │
    └────┬─────┘
         │
    ┌────▼──────────┐
    │  Registry    │
    │  Push        │
    └────┬──────────┘
         │
    ┌────▼──────────┐
    │  Deploy      │
    │  Docker      │
    │  Compose     │
    └──────────────┘
```

## Prerequisites

### Local Development
- **Node.js** 18+
- **npm** 9+
- **Docker** 20.10+
- **Docker Compose** 2.0+

### CI/CD (GitHub Actions)
- GitHub account with repository access
- GitHub Secrets configured:
  - `DOCKER_TOKEN` - Docker Hub personal access token
  - `SONAR_TOKEN` - SonarCloud token

### Jenkins Setup
- Jenkins server installed
- Docker installed on Jenkins agent
- Node.js plugin installed
- SonarQube plugin installed
- Docker plugin installed

---

## Docker Setup

### Build Docker Image
```bash
docker build -t food-app:latest .
```

### Run Single Container
```bash
docker run -p 5173:5173 food-app:latest
```

### Docker Compose (Recommended)
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f food-app

# Stop all services
docker-compose down
```

### Services in docker-compose.yml
1. **food-app** - React frontend (port 5173)
2. **api-server** - Node.js backend (port 3000)
3. **database** - MongoDB (port 27017)

---

## GitHub Actions CI/CD Pipeline

### Workflows

#### 1. **CI/CD Pipeline** (`.github/workflows/ci.yml`)
Triggers on push and PR to main/develop branches.

**Stages:**
- ✅ Checkout & Install Dependencies
- 🔍 Code Linting (ESLint)
- ✅ Unit Tests
- 🔨 Build
- 📊 SonarQube Analysis
- 🐳 Docker Build & Push
- 🚀 Deploy (main branch only)
- 🏥 Health Check

#### 2. **Security Scan** (`.github/workflows/security-scan.yml`)
Runs on schedule (weekly) + push/PR events.

**Checks:**
- npm audit (dependency vulnerabilities)
- CodeQL (SAST analysis)
- Snyk (vulnerability scanning)
- Trivy (container image scanning)

#### 3. **Docker Build** (`.github/workflows/docker-build.yml`)
Triggered after successful CI/CD pipeline.

---

## Jenkins Pipeline Setup

### Prerequisites
1. Install Jenkins plugins:
   - NodeJS Plugin
   - Docker Pipeline
   - SonarQube Scanner
   - Workspace Cleanup

2. Configure Jenkins:
   - NodeJS: Manage Jenkins → Tools → NodeJS → Add (v18)
   - SonarQube: Manage Jenkins → Configure System → SonarQube

3. Create Docker Hub Credentials:
   - Credentials ID: `docker-hub-credentials`

### Create Pipeline Job
1. New Job → Pipeline
2. Pipeline script from SCM: Git
3. Repository URL: `https://github.com/YOUR_USERNAME/food-app.git`
4. Branches to build: `main`
5. Script path: `Jenkinsfile`

### Jenkinsfile Stages
1. **Checkout** - Get code from Git
2. **Install Dependencies** - npm ci
3. **Code Quality** - ESLint
4. **Unit Tests** - npm test
5. **Build** - npm run build
6. **SonarQube** - Static analysis
7. **Docker Build** - Build image
8. **Docker Push** - Push to registry (main branch)
9. **Deploy** - docker-compose up
10. **Health Check** - Verify deployment

---

## Code Quality Tools

### ESLint Configuration (`.eslintrc.json`)
- TypeScript support
- React & React Hooks plugins
- Enforces code style

**Run locally:**
```bash
npm run lint
```

**Install ESLint first:**
```bash
npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-react eslint-plugin-react-hooks
```

### SonarQube Configuration (`sonar-project.properties`)
Analyzes code quality, security, and coverage.

**Integrated in:**
- GitHub Actions
- Jenkins Pipeline

---

## Environment Variables

### Docker Environment
- `NODE_ENV=production` - Production mode

### MongoDB
- `MONGO_INITDB_ROOT_USERNAME=admin`
- `MONGO_INITDB_ROOT_PASSWORD=password`

---

## Deployment

### Local Deployment (Docker Compose)
```bash
docker-compose up -d
```

Access:
- Frontend: http://localhost:5173
- API: http://localhost:3000
- MongoDB: mongodb://admin:password@localhost:27017

### Production Deployment
Automatically triggered on push to `main` branch in GitHub Actions.

### Manual Docker Push
```bash
docker login
docker tag food-app:latest USERNAME/food-app:latest
docker push USERNAME/food-app:latest
```

---

## Monitoring & Health Checks

### Health Check Configuration
- **Interval**: 30 seconds
- **Timeout**: 3 seconds
- **Retries**: 3 attempts
- **Start period**: 40 seconds

Check health:
```bash
curl http://localhost:5173
```

---

## File Structure

```
.
├── Dockerfile                      # Multi-stage Docker build
├── docker-compose.yml              # Multi-container orchestration
├── .dockerignore                   # Files to exclude from Docker
├── Jenkinsfile                     # Jenkins pipeline script
├── .eslintrc.json                  # ESLint configuration
├── sonar-project.properties        # SonarQube configuration
├── .github/workflows/
│   ├── ci.yml                      # GitHub Actions CI/CD
│   ├── security-scan.yml           # Security scanning
│   └── docker-build.yml            # Docker build workflow
└── [existing project files]
```

---

## Troubleshooting

### Docker Issues
```bash
# Clean up containers
docker-compose down --volumes

# Rebuild everything
docker-compose up -d --build

# Check logs
docker-compose logs -f [service-name]
```

### Jenkins Build Failures
1. Check Jenkins logs: `/var/log/jenkins/jenkins.log`
2. Verify Node.js installation
3. Ensure Docker is running
4. Check Docker credentials

### GitHub Actions Failures
1. Check workflow runs in repo → Actions tab
2. Verify secrets: Settings → Secrets and variables
3. Check branch protection rules

---

## Best Practices

✅ **Do:**
- Use environment variables for sensitive data
- Run tests before deployment
- Use multi-stage Docker builds
- Monitor health checks
- Keep dependencies updated
- Use semantic versioning

❌ **Don't:**
- Commit sensitive data to repo
- Run without tests
- Use large Docker images
- Ignore security warnings
- Skip code quality checks

---

## Resources

- [Docker Documentation](https://docs.docker.com/)
- [Jenkins Pipeline](https://www.jenkins.io/doc/book/pipeline/)
- [GitHub Actions](https://docs.github.com/en/actions)
- [SonarQube](https://docs.sonarqube.org/)
- [ESLint](https://eslint.org/docs/rules/)

---

## Support

For issues or questions, please create an issue in the repository.
