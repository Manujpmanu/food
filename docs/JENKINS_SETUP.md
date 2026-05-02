# Jenkins Setup Guide

## Installation on Windows

### 1. Install Java
```bash
# Using Chocolatey
choco install openjdk -y

# Verify installation
java -version
```

### 2. Install Jenkins
```bash
# Using Chocolatey
choco install jenkins -y

# Start Jenkins service
net start Jenkins

# Access Jenkins
# http://localhost:8080
```

### 3. Initial Setup
1. Unlock Jenkins with password from: `C:\Program Files (x86)\Jenkins\secrets\initialAdminPassword`
2. Install suggested plugins
3. Create first admin user
4. Configure Jenkins URL

## Required Plugins

1. **Manage Jenkins** → **Manage Plugins** → **Available**
2. Install these plugins:
   - NodeJS Plugin
   - Docker Pipeline
   - SonarQube Scanner
   - Workspace Cleanup Plugin
   - GitHub Integration Plugin
   - Credentials Binding Plugin

## Configuration

### Node.js
1. Go to **Manage Jenkins** → **Global Tool Configuration**
2. Scroll to **NodeJS**
3. Click **Add NodeJS**
   - Name: `Node18`
   - Version: `18.x.x`
   - Check "Install automatically"

### Docker
1. Go to **Manage Jenkins** → **Global Tool Configuration**
2. Scroll to **Docker**
3. Click **Add Docker**
   - Name: `Docker`
   - Check "Install automatically"

### SonarQube
1. Go to **Manage Jenkins** → **Configure System**
2. Scroll to **SonarQube servers**
3. Click **Add SonarQube**
   - Name: `SonarQube`
   - Server URL: `http://localhost:9000`
   - Server authentication token: [Your SonarQube token]

## Credentials Setup

1. **Manage Jenkins** → **Manage Credentials**
2. Click **System** → **Global credentials**
3. Click **Add Credentials**

### Docker Hub
- Kind: **Username with password**
- Scope: **Global**
- Username: `[Docker username]`
- Password: `[Docker personal access token]`
- ID: `docker-hub-credentials`

### GitHub
- Kind: **Username with password**
- Username: `[GitHub username]`
- Password: `[GitHub personal access token]`
- ID: `github-credentials`

## Create Pipeline Job

1. **New Item** → Enter name: `food-app-pipeline`
2. Select **Pipeline**
3. Click **OK**
4. Configure:

### General
- Description: "Food Ordering App CI/CD Pipeline"
- GitHub Project: `https://github.com/YOUR_USERNAME/food-app`

### Build Triggers
- Check **GitHub hook trigger for GITScm polling**
- Check **Poll SCM** (schedule: `H/15 * * * *`)

### Pipeline
- Definition: **Pipeline script from SCM**
- SCM: **Git**
  - Repositories URL: `https://github.com/YOUR_USERNAME/food-app.git`
  - Credentials: `github-credentials`
  - Branches to build: `*/main`
- Script path: `Jenkinsfile`

5. Click **Save**

## GitHub Webhook Setup

1. Go to GitHub Repository → **Settings** → **Webhooks**
2. Click **Add webhook**
3. Configure:
   - Payload URL: `http://JENKINS_URL:8080/github-webhook/`
   - Content type: `application/json`
   - Events: **Push events** + **Pull requests**
   - Active: ✓

## Running the Pipeline

### Manual Trigger
1. Go to Jenkins Dashboard
2. Click **food-app-pipeline**
3. Click **Build Now**

### Automatic Trigger
- Push to main branch
- Create/update pull request
- GitHub webhook triggers Jenkins

## View Build Logs

1. Click **Build History** → **Build number**
2. Click **Console Output**
3. Watch real-time logs

## Troubleshooting

### Build Fails at Node.js
```bash
# SSH to Jenkins agent and verify Node.js
node --version
npm --version
```

### Docker Build Fails
- Ensure Docker is running
- Check Docker credentials
- Verify Dockerfile syntax

### SonarQube Connection Error
- Verify SonarQube is running
- Check server URL and token
- Check firewall rules

## Additional Configuration

### Email Notifications
1. **Manage Jenkins** → **Configure System**
2. Scroll to **Extended E-mail Notification**
3. Configure SMTP server
4. Add post-build action: **Editable Email Notification**

### Slack Integration
1. Install **Slack Notification Plugin**
2. Get Slack webhook URL
3. Add post-build action: **Slack Notification**
