# Jenkins Docker Troubleshooting Guide

You're getting "docker: command not found" even though Docker is installed. Here are the solutions:

## 🐳 **Docker Access Issues in Jenkins**

### **Problem:** Docker is installed but Jenkins can't access it

The issue is that Jenkins is running as a different user and doesn't have access to Docker.

### **Solution 1: Add Jenkins User to Docker Group (Recommended)**

```bash
# Add jenkins user to docker group
sudo usermod -aG docker jenkins

# Restart Jenkins service
sudo systemctl restart jenkins

# Verify docker access (as jenkins user)
sudo -u jenkins docker --version
sudo -u jenkins docker ps
```

### **Solution 2: Fix Docker Socket Permissions**

```bash
# Make docker socket accessible
sudo chmod 666 /var/run/docker.sock

# Or better, set group ownership
sudo chown root:docker /var/run/docker.sock
sudo chmod 660 /var/run/docker.sock
```

### **Solution 3: Configure Docker Daemon for Jenkins**

Create/edit `/etc/docker/daemon.json`:
```json
{
  "hosts": ["unix:///var/run/docker.sock", "tcp://0.0.0.0:2376"],
  "group": "docker"
}
```

Then restart Docker:
```bash
sudo systemctl restart docker
sudo systemctl restart jenkins
```

## 🔄 **Alternative: Use Node.js Instead of Docker**

If Docker continues to be problematic, use the Node.js version:

### **Step 1: Install NodeJS Plugin**
1. Go to Jenkins → Manage Jenkins → Manage Plugins
2. Install "NodeJS Plugin"
3. Restart Jenkins

### **Step 2: Configure Node.js**
1. Go to Jenkins → Manage Jenkins → Global Tool Configuration
2. Add NodeJS installation:
   - Name: `Node-18`
   - Install automatically: ✅
   - Version: Latest Node 18.x

### **Step 3: Use Alternative Jenkinsfile**
Replace your current Jenkinsfile with `Jenkinsfile.nodejs` (already created for you)

## 🧪 **Quick Test Commands**

Test Docker access from Jenkins:

```bash
# Test as jenkins user
sudo -u jenkins docker --version
sudo -u jenkins docker run hello-world

# Check docker group membership
groups jenkins

# Check docker socket permissions
ls -la /var/run/docker.sock
```

## 🔧 **Immediate Fix Options**

### **Option A: Fix Docker (5 minutes)**
```bash
sudo usermod -aG docker jenkins
sudo systemctl restart jenkins
# Then retry your current Jenkinsfile
```

### **Option B: Switch to Node.js (2 minutes)**
1. Install NodeJS plugin in Jenkins
2. Configure Node-18 in Global Tool Configuration  
3. Rename `Jenkinsfile` to `Jenkinsfile.docker`
4. Rename `Jenkinsfile.nodejs` to `Jenkinsfile`
5. Commit and push

## 🚨 **Security Note**

Adding jenkins to docker group gives it root-equivalent access. For production:

1. Use dedicated Jenkins agents with Docker
2. Consider Docker-in-Docker (DinD) solutions
3. Use Kubernetes with proper RBAC

## ✅ **Verification Steps**

After applying fixes:

1. **Test Docker access:**
```bash
sudo -u jenkins docker run --rm hello-world
```

2. **Test in Jenkins:**
Create a simple pipeline:
```groovy
pipeline {
    agent { docker { image 'hello-world' } }
    stages {
        stage('Test') {
            steps {
                echo 'Docker works!'
            }
        }
    }
}
```

## 🎯 **Recommended Action**

For quickest resolution:

1. **Try Docker fix first:**
   ```bash
   sudo usermod -aG docker jenkins
   sudo systemctl restart jenkins
   ```

2. **If that doesn't work, switch to Node.js:**
   - Use the `Jenkinsfile.nodejs` I created
   - Install NodeJS plugin
   - Configure Node-18

Both approaches will work - Docker provides more consistency, but Node.js is simpler to set up.