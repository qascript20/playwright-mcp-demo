# Jenkins Setup Guide for Playwright Demo

This guide will help you set up and run the Playwright tests in Jenkins using the Docker-based pipeline.

## 🚀 Quick Start Checklist

- [ ] Jenkins server with Docker support
- [ ] Required Jenkins plugins installed
- [ ] GitHub repository access configured
- [ ] Pipeline job created and configured

## 📋 Prerequisites

### 1. Jenkins Installation
Ensure you have Jenkins installed with:
- Jenkins 2.400+ (recommended)
- Docker daemon running on Jenkins server/agents
- Internet access for pulling Docker images

### 2. Required Jenkins Plugins

Install these plugins via **Manage Jenkins → Manage Plugins**:

```
✅ Docker Pipeline Plugin
✅ HTML Publisher Plugin  
✅ JUnit Plugin
✅ Pipeline Plugin
✅ Git Plugin
✅ GitHub Plugin (if using GitHub)
```

**Installation Command (Jenkins CLI):**
```bash
jenkins-cli install-plugin docker-workflow html-publisher junit pipeline-stage-view git github
```

### 3. Docker Configuration

Ensure Docker is properly configured:
```bash
# Verify Docker is running
docker --version
docker run hello-world

# Verify Jenkins can access Docker
sudo usermod -aG docker jenkins
sudo systemctl restart jenkins
```

## 🔧 Step-by-Step Setup

### Step 1: Create New Pipeline Job

1. **Navigate to Jenkins Dashboard**
2. **Click "New Item"**
3. **Enter job name**: `playwright-demo-tests`
4. **Select "Pipeline"**
5. **Click "OK"**

### Step 2: Configure Pipeline

#### General Configuration:
```
✅ GitHub project: https://github.com/qascript20/playwright-mcp-demo
✅ Discard old builds: 
   - Days to keep builds: 30
   - Max # of builds to keep: 50
```

#### Build Triggers (Optional):
```
✅ GitHub hook trigger for GITScm polling
✅ Poll SCM: H/15 * * * * (every 15 minutes)
```

#### Pipeline Configuration:
```
Definition: Pipeline script from SCM
SCM: Git
Repository URL: https://github.com/qascript20/playwright-mcp-demo.git
Branch: */main
Script Path: Jenkinsfile
```

### Step 3: Configure Parameters (Auto-detected from Jenkinsfile)

The pipeline will automatically detect these parameters:
- **BROWSER**: all, chromium, firefox, webkit, mobile-chrome
- **TEST_SUITE**: all, booking, login, checkout, responsive  
- **HEADED_MODE**: true/false (disabled in Docker)
- **GREP_PATTERN**: Optional test pattern

### Step 4: Save and Test

1. **Click "Save"**
2. **Click "Build with Parameters"**
3. **Select your preferences**
4. **Click "Build"**

## 🐳 Docker Image Verification

Before running, verify the Playwright Docker image:

```bash
# Pull the image manually (optional)
docker pull mcr.microsoft.com/playwright:v1.55.1-focal

# Verify image contents
docker run --rm mcr.microsoft.com/playwright:v1.55.1-focal npx playwright --version
```

## 🔍 Troubleshooting Common Issues

### Issue 1: Docker Permission Denied
```bash
# Solution: Add Jenkins user to docker group
sudo usermod -aG docker jenkins
sudo systemctl restart jenkins
```

### Issue 2: "Docker not found"
```bash
# Verify Docker is installed and running
systemctl status docker
docker --version

# Install Docker if missing
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```

### Issue 3: "Image pull failed"
```bash
# Check internet connectivity
docker pull hello-world

# Try alternative registry
docker pull mcr.microsoft.com/playwright:v1.55.1-focal
```

### Issue 4: "No tests found"
Check your repository structure:
```
playwright-demo/
├── tests/
│   ├── booking.spec.ts
│   ├── login.spec.ts
│   └── checkout.spec.ts
├── playwright.config.js
└── package.json
```

### Issue 5: Tests Failing in Docker
Common Docker-specific issues:
```groovy
// Add these environment variables if needed
environment {
    DISPLAY = ':99'
    PLAYWRIGHT_BROWSERS_PATH = '/ms-playwright'
    NODE_ENV = 'test'
}
```

## 📊 Viewing Test Results

After successful build:

1. **Console Output**: Click build number → Console Output
2. **Test Results**: Build page → Test Results tab
3. **HTML Report**: Build page → Playwright Test Report
4. **Artifacts**: Build page → Build Artifacts

## 🔧 Advanced Configuration

### Custom Docker Args
```groovy
agent {
    docker {
        image 'mcr.microsoft.com/playwright:v1.55.1-focal'
        args '''
            --user root 
            --shm-size=2gb
            -v /var/run/docker.sock:/var/run/docker.sock
            --cap-add=SYS_ADMIN
        '''
    }
}
```

### Environment-Specific Configuration
```groovy
environment {
    ENVIRONMENT = "${params.ENVIRONMENT ?: 'staging'}"
    BASE_URL = "${env.ENVIRONMENT == 'production' ? 'https://prod.example.com' : 'https://staging.example.com'}"
}
```

### Parallel Test Execution
```groovy
stage('Run Tests') {
    parallel {
        stage('Chrome Tests') {
            steps {
                sh 'npx playwright test --project=chromium'
            }
        }
        stage('Firefox Tests') {
            steps {
                sh 'npx playwright test --project=firefox'
            }
        }
    }
}
```

## 🚨 Common Error Messages & Solutions

| Error | Solution |
|-------|----------|
| `docker: command not found` | Install Docker on Jenkins agent |
| `permission denied: docker` | Add jenkins user to docker group |
| `Failed to pull image` | Check internet connectivity and image name |
| `No such file: package.json` | Verify repository checkout and file paths |
| `Browser not found` | Use official Playwright Docker image |
| `Tests failed: ECONNREFUSED` | Check network connectivity from container |

## 📝 Best Practices

1. **Use specific image tags** (not `latest`)
2. **Set appropriate timeouts** for your tests
3. **Archive test artifacts** for debugging
4. **Use environment variables** for configuration
5. **Set up notifications** for build failures
6. **Regular image updates** for security patches

## 🎯 Example Build Command

Manual Jenkins CLI build:
```bash
java -jar jenkins-cli.jar -s http://your-jenkins-url/ build playwright-demo-tests \
  -p BROWSER=chromium \
  -p TEST_SUITE=booking \
  -p HEADED_MODE=false
```

## 📞 Getting Help

If you encounter issues:

1. **Check Jenkins logs**: `/var/log/jenkins/jenkins.log`
2. **Check Docker logs**: `docker logs <container_id>`
3. **Verify file permissions**: Ensure Jenkins can read your repository
4. **Test locally**: Run the same Docker command locally first

---

✅ **Ready to run!** Your Playwright tests should now execute successfully in Jenkins using the Docker-based pipeline.