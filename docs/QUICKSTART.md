# Quick Start Guide - DevOps & CI/CD

## 🚀 Get Started in 5 Minutes

### 1. **Local Docker Setup**
```bash
# Install dependencies
npm install

# Build Docker image
docker build -t food-app .

# Run with Docker Compose
docker-compose up -d

# Access the app
# Frontend: http://localhost:5173
# MongoDB: mongodb://admin:password@localhost:27017
```

### 2. **GitHub Actions Setup**
```bash
# 1. Fork this repository
# 2. Go to Settings → Secrets and variables → Actions
# 3. Add these secrets:
#    - DOCKER_TOKEN: Your Docker Hub token
#    - SONAR_TOKEN: Your SonarCloud token
# 4. Push to main branch
# 5. GitHub Actions automatically runs!
```

### 3. **Jenkins Setup (Optional)**
```bash
# Install Jenkins
choco install jenkins -y

# Install plugins via Jenkins UI
# Manage Jenkins → Manage Plugins → Search:
#   - NodeJS
#   - Docker Pipeline
#   - SonarQube Scanner

# Create pipeline job pointing to Jenkinsfile
```

## 📁 Key Files

| File | Purpose |
|------|---------|
| `Dockerfile` | Container image definition |
| `docker-compose.yml` | Multi-container orchestration |
| `Jenkinsfile` | Jenkins pipeline script |
| `.github/workflows/ci.yml` | GitHub Actions CI/CD |
| `.github/workflows/security-scan.yml` | Security scanning |
| `.eslintrc.json` | Code linting rules |
| `sonar-project.properties` | Code quality config |

## 🔄 CI/CD Pipeline Flow

```
Push Code → GitHub Actions Triggered
  ↓
Lint & Test Code
  ↓
Build Application
  ↓
SonarQube Analysis
  ↓
Build Docker Image
  ↓
Push to Registry
  ↓
Deploy (main branch only)
  ↓
Health Check
```

## ✅ Verify Setup

### Docker
```bash
# Test Docker build
docker build -t food-app:test .

# Test Docker Compose
docker-compose up -d
docker-compose ps
docker-compose down
```

### GitHub Actions
1. Go to your repo → **Actions** tab
2. Trigger a workflow by pushing code
3. Watch the pipeline run in real-time

### Jenkins (if using)
1. Open http://localhost:8080
2. Create new Pipeline job
3. Point to your GitHub repo
4. Trigger a build

## 🛠️ Common Commands

```bash
# Development
npm install                 # Install dependencies
npm run dev               # Run dev server
npm run build             # Build for production
npm run lint              # Check code quality
npm test                  # Run tests

# Docker
docker-compose up -d      # Start all services
docker-compose down       # Stop all services
docker-compose logs -f    # View live logs
docker-compose ps         # List running containers

# Code Quality
npm audit                 # Check dependencies
npm audit fix             # Fix vulnerabilities
npm run lint -- --fix     # Auto-fix linting issues
```

## 📊 Monitoring

### Health Check
```bash
curl http://localhost:5173
```

### View Logs
```bash
docker-compose logs -f food-app
docker-compose logs -f api-server
docker-compose logs -f database
```

### Container Stats
```bash
docker stats
```

## 🔐 Security

- Secrets are stored in GitHub Secrets
- Docker images are scanned for vulnerabilities
- Code quality analyzed with SonarQube
- Dependency vulnerabilities checked with npm audit

## 📚 Documentation

- **[DEVOPS.md](DEVOPS.md)** - Complete DevOps guide
- **[JENKINS_SETUP.md](JENKINS_SETUP.md)** - Jenkins installation & config
- **[GITHUB_SECRETS.md](GITHUB_SECRETS.md)** - GitHub Secrets setup

## ❓ FAQ

**Q: How do I trigger the pipeline manually?**
A: Push to main/develop branch or click "Run workflow" in GitHub Actions tab.

**Q: Can I use this with Jenkins instead of GitHub Actions?**
A: Yes! The Jenkinsfile is provided for Jenkins CI/CD.

**Q: How do I deploy to production?**
A: Push to main branch - automatic deployment via GitHub Actions.

**Q: Where are my secrets stored?**
A: In GitHub Secrets (Settings → Secrets and variables → Actions).

**Q: Can I customize the pipeline?**
A: Yes! Edit `.github/workflows/ci.yml` or `Jenkinsfile`.

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| Docker build fails | Check Dockerfile syntax, ensure Docker is running |
| GitHub Actions not triggering | Add secrets, check workflow YAML syntax |
| SonarQube connection fails | Verify token, check server URL |
| Jenkins build fails | Check Node.js plugin, verify Jenkinsfile syntax |

## 📞 Support

For issues:
1. Check logs: `docker-compose logs`
2. Review workflow: GitHub Actions → Actions tab
3. Check Jenkins logs: Jenkins UI → Build logs
4. Read the detailed guides: DEVOPS.md, JENKINS_SETUP.md

---

**Happy DevOps-ing! 🎉**
