# 🎯 Food App - Complete CI/CD & DevOps Implementation

## 📦 What's Included

Your food app now has enterprise-grade CI/CD and DevOps setup:

### ✅ **Docker Containerization**
- Multi-stage Dockerfile for optimized builds
- Docker Compose with 3 services: frontend, API, database
- Health checks and restart policies
- Volume management

### ✅ **GitHub Actions CI/CD Pipeline**
- Automated testing on every push
- Code linting with ESLint
- Docker image build and push
- Automatic deployment (main branch)
- Security scanning (CodeQL, Snyk, npm audit)
- SonarQube code quality analysis

### ✅ **Jenkins Pipeline**
- Complete Jenkinsfile for Jenkins integration
- 10-stage pipeline from checkout to health check
- Docker image build and push
- SonarQube integration
- Automated deployment

### ✅ **Code Quality**
- ESLint configuration (.eslintrc.json)
- TypeScript strict mode
- SonarQube integration
- Dependency vulnerability checks

### ✅ **Documentation**
- DEVOPS.md - Complete DevOps guide
- JENKINS_SETUP.md - Jenkins installation steps
- GITHUB_SECRETS.md - GitHub Secrets configuration
- QUICKSTART.md - 5-minute quick start

### ✅ **Helper Scripts**
- setup.sh / setup.bat - One-command setup
- cleanup.sh / cleanup.bat - Clean Docker and dependencies
- npm scripts for common tasks

---

## 📊 File Structure

```
food/
├── 📄 Dockerfile                    ✨ Docker image build config
├── 📄 docker-compose.yml            ✨ Multi-container orchestration
├── 📄 docker-compose.sonarqube.yml  ✨ Optional local SonarQube setup
├── 📄 .dockerignore                 ✨ Docker optimization
├── 📄 Jenkinsfile                   ✨ Jenkins pipeline
├── 📄 .eslintrc.json                ✨ ESLint configuration
├── 📄 sonar-project.properties      ✨ SonarQube configuration
├── 📄 setup.sh / setup.bat          ✨ One-command setup
├── 📄 cleanup.sh / cleanup.bat      ✨ Cleanup utilities
├── 📄 package.json                  ✨ Updated with npm scripts
├── 📁 .github/workflows/
│   ├── 📄 ci.yml                    ✨ Main CI/CD pipeline
│   ├── 📄 security-scan.yml         ✨ Security scanning
│   └── 📄 docker-build.yml          ✨ Docker build workflow
├── 📄 DEVOPS.md                     📚 Complete documentation
├── 📄 JENKINS_SETUP.md              📚 Jenkins guide
├── 📄 GITHUB_SECRETS.md             📚 Secrets setup
├── 📄 QUICKSTART.md                 📚 Quick start guide
└── [existing project files]
```

---

## 🚀 Quick Start (Choose One)

### Option 1: **Windows Users**
```bash
# 1. Run setup script
.\setup.bat

# 2. Access applications
# Frontend: http://localhost:5173
# MongoDB: mongodb://admin:password@localhost:27017
```

### Option 2: **Mac/Linux Users**
```bash
# 1. Make script executable
chmod +x setup.sh

# 2. Run setup
./setup.sh

# 3. Access applications
# Frontend: http://localhost:5173
```

### Option 3: **Manual Setup**
```bash
# 1. Install dependencies
npm install --legacy-peer-deps

# 2. Build Docker image
docker build -t food-app:latest .

# 3. Start services
docker-compose up -d

# 4. Verify
docker-compose ps
```

---

## 🔄 Available npm Scripts

```bash
# Development
npm run dev                # Start dev server
npm run build              # Build for production
npm run lint              # Run ESLint check
npm run lint:fix          # Auto-fix linting issues

# Type Checking
npm run type-check        # TypeScript type checking

# Docker Commands
npm run docker:build      # Build Docker image
npm run docker:run        # Run container
npm run docker:up         # Start docker-compose
npm run docker:down       # Stop docker-compose
npm run docker:logs       # View logs
npm run docker:clean      # Full cleanup

# Security & Quality
npm audit                 # Check dependencies
npm run ci                # Full CI pipeline (lint + type-check + build)

# Setup & Cleanup
npm run setup             # Install deps + start Docker
npm run cleanup           # Remove containers + dependencies
```

---

## 🔐 GitHub Actions Setup

### Step 1: Add Secrets
Go to: **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

```
DOCKER_TOKEN = <Your Docker Hub Token>
SONAR_TOKEN = <Your SonarCloud Token>
```

### Step 2: Push to GitHub
```bash
git add .
git commit -m "Add CI/CD and DevOps"
git push origin main
```

### Step 3: Watch Pipeline
Go to: **Actions** tab → Watch the workflow run

---

## 🏗️ Pipeline Stages Explained

### **GitHub Actions Pipeline** (`.github/workflows/ci.yml`)

```
1. 📥 Checkout & Dependencies (npm ci)
     ↓
2. 🔍 Code Linting (ESLint)
     ↓
3. ✅ Unit Tests (npm test)
     ↓
4. 🔨 Build (npm run build)
     ↓
5. 📊 SonarQube Analysis
     ↓
6. 🐳 Docker Build
     ↓
7. 📤 Push to Registry (main branch only)
     ↓
8. 🚀 Deploy (docker-compose up)
     ↓
9. 🏥 Health Check (curl http://localhost:5173)
```

### **Jenkins Pipeline** (`Jenkinsfile`)

Same 10 stages with Jenkins-specific environment setup

---

## 🐳 Docker Services

### Frontend (`food-app`)
- **Image**: node:18-alpine (optimized)
- **Port**: 5173
- **Command**: `serve -s dist -l 5173`
- **Health Check**: Every 30 seconds

### API Server (`api-server`)
- **Image**: node:18-alpine
- **Port**: 3000
- **Mount**: Volume mapping for development

### Database (`database`)
- **Image**: mongo:6.0-alpine
- **Port**: 27017
- **Credentials**: admin/password
- **Volume**: mongodb_data (persistent)

---

## 📋 Configuration Files

### `Dockerfile`
Multi-stage build for production:
- **Stage 1**: Build with Node.js
- **Stage 2**: Lightweight runtime with serve
- **Benefits**: Reduces image size, improves security

### `docker-compose.yml`
Orchestrates 3 containers with:
- Network communication
- Environment variables
- Volume management
- Health checks
- Restart policies

### `.eslintrc.json`
Code quality rules:
- React & React Hooks support
- TypeScript enforcement
- Consistent formatting
- Naming conventions

### `sonar-project.properties`
Code analysis configuration:
- Source exclusions
- Test coverage paths
- Encoding settings

---

## 🛠️ Common Tasks

### Build and Test Locally
```bash
npm run lint              # Check code quality
npm run type-check        # Check TypeScript
npm run build             # Build application
```

### Start Docker Services
```bash
docker-compose up -d      # Start in background
docker-compose logs -f    # Watch logs
docker-compose ps         # List services
```

### Clean Everything
```bash
# Option 1: Use npm script
npm run cleanup

# Option 2: Use Docker
docker-compose down -v
docker system prune -f

# Option 3: Use cleanup script
./cleanup.sh              # Mac/Linux
.\cleanup.bat             # Windows
```

### Deploy Changes
```bash
# 1. Commit and push to main
git add .
git commit -m "Feature description"
git push origin main

# 2. GitHub Actions automatically:
#    - Runs tests
#    - Builds app
#    - Creates Docker image
#    - Deploys to production
```

---

## 🔍 Monitoring & Debugging

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f food-app
docker-compose logs -f api-server
docker-compose logs -f database
```

### Check Health
```bash
# Frontend
curl http://localhost:5173

# API Server
curl http://localhost:3000

# Database
docker exec -it food-app-db mongosh admin -u admin -p password
```

### View Running Containers
```bash
docker ps
docker stats
```

---

## 🔐 Security Features

✅ **Dependency Scanning** - npm audit checks vulnerabilities
✅ **SAST Analysis** - CodeQL scans source code
✅ **Container Scanning** - Trivy scans Docker images
✅ **Code Quality** - SonarQube enforces standards
✅ **Access Control** - Secrets stored securely in GitHub

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| **DEVOPS.md** | Complete DevOps architecture and guide |
| **JENKINS_SETUP.md** | Step-by-step Jenkins installation |
| **GITHUB_SECRETS.md** | GitHub Actions secrets setup |
| **QUICKSTART.md** | 5-minute quick start guide |
| **README.md** | Project overview (existing) |

---

## ❓ Troubleshooting

### Docker Issues
```bash
# Check if Docker is running
docker ps

# Rebuild everything
docker-compose down
docker-compose up -d --build

# Clean and restart
docker system prune -a
docker-compose up -d
```

### GitHub Actions Not Running
1. Check `.github/workflows/` files exist
2. Verify secrets in Settings
3. Review workflow syntax: `https://github.com/YOUR_USERNAME/food-app/actions`

### ESLint Errors
```bash
# View all issues
npm run lint

# Auto-fix issues
npm run lint:fix
```

### Docker Push Fails
```bash
# Login to Docker Hub
docker login

# Verify credentials stored correctly
```

---

## 🎯 Next Steps

1. **✅ Initialize Git** (if not already done)
   ```bash
   git init
   git add .
   git commit -m "Initial commit with CI/CD setup"
   ```

2. **✅ Create GitHub Repository**
   - Go to github.com/new
   - Create repository
   - Push your code

3. **✅ Configure GitHub Secrets**
   - Add DOCKER_TOKEN
   - Add SONAR_TOKEN (optional)

4. **✅ (Optional) Setup Jenkins**
   - Follow JENKINS_SETUP.md
   - Create pipeline job
   - Configure GitHub webhook

5. **✅ Monitor Pipeline**
   - Push changes to main
   - Watch Actions tab
   - Check deployment

---

## 📊 Performance Tips

- Use `.dockerignore` to exclude unnecessary files
- Multi-stage Dockerfile keeps images small
- Alpine base images are lightweight
- Health checks prevent hanging containers
- Resource limits prevent runaway processes

---

## 🔗 Useful Links

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [GitHub Actions](https://docs.github.com/en/actions)
- [Jenkins Pipeline](https://www.jenkins.io/doc/book/pipeline/)
- [SonarQube](https://docs.sonarqube.org/)
- [ESLint](https://eslint.org/docs/rules/)

---

## ✨ Summary

Your food app now has:
- ✅ Containerization with Docker
- ✅ Multi-container orchestration
- ✅ Automated CI/CD pipeline (GitHub Actions)
- ✅ Jenkins pipeline option
- ✅ Code quality analysis
- ✅ Security scanning
- ✅ Automated deployment
- ✅ Complete documentation

**You're ready for production! 🚀**

---

For detailed information, refer to the specific documentation files:
- Questions about setup? → Read **QUICKSTART.md**
- Need Jenkins? → Read **JENKINS_SETUP.md**
- Setting up GitHub? → Read **GITHUB_SECRETS.md**
- Deep dive needed? → Read **DEVOPS.md**
