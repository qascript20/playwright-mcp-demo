# Jenkins Configuration for Playwright Tests

This directory contains Jenkins pipeline configuration for running Playwright tests with NodeJS.

## Prerequisites

Before using this Jenkins configuration, ensure the following are set up in your Jenkins instance:

### 1. NodeJS Installation
1. Go to **Jenkins** → **Manage Jenkins** → **Global Tool Configuration**
2. Scroll to **NodeJS** section
3. Click **Add NodeJS**
4. Configure:
   - **Name**: `NodeJS` (must match the name in Jenkinsfile)
   - **Version**: Select Node.js 18.x or later (recommended: 20.x LTS)
   - Check "Install automatically"
5. Click **Save**

### 2. Required Jenkins Plugins
Install the following plugins via **Manage Jenkins** → **Manage Plugins**:
- **NodeJS Plugin** - For NodeJS tool configuration
- **Pipeline** - For Pipeline support
- **HTML Publisher Plugin** - For publishing Playwright HTML reports
- **JUnit Plugin** - For publishing test results
- **Git Plugin** - For source code checkout

### 3. System Requirements
Ensure Jenkins agents have sufficient resources:
- **Memory**: At least 4GB RAM
- **Disk Space**: At least 5GB free space
- **OS**: Linux (Ubuntu/Debian recommended) or macOS

## Jenkins Pipeline Files

### Jenkinsfile
The main parameterized pipeline configuration file that defines:
- **Build Parameters**: Configurable options for browser, test suite, and execution mode
- **Checkout**: Retrieves code from Git repository
- **Install Dependencies**: Installs npm packages using `npm ci`
- **Install Playwright Browsers**: Installs required browsers (Chromium, Firefox, WebKit)
- **Run Tests**: Executes Playwright tests with selected parameters
- **Post Actions**: Publishes reports and archives artifacts

### Jenkinsfile.parameterized
Enhanced parameterized version with additional features:
- All features from main Jenkinsfile
- Display build parameters summary
- Environment selection (production, staging, development)
- Trace generation control
- Detailed build summary

### Jenkinsfile.parallel
Parallel execution variant:
- Runs tests simultaneously across multiple browsers
- Faster execution for comprehensive testing

### Jenkinsfile.docker
Docker-based execution:
- Uses official Playwright Docker image
- No browser installation needed

## Build Parameters

The parameterized Jenkinsfile supports the following build parameters:

### Browser Selection
- **Name**: `BROWSER`
- **Type**: Choice
- **Options**: all, chromium, firefox, webkit, mobile-chrome, mobile-safari
- **Description**: Select which browser to run tests on

### Test Suite Selection
- **Name**: `TEST_SUITE`
- **Type**: Choice
- **Options**: all, booking, login, checkout, responsive-login
- **Description**: Select specific test suite to run

### Execution Modes
- **HEADED_MODE**: Run tests with browser UI visible (default: false)
- **DEBUG_MODE**: Run tests in debug mode for troubleshooting (default: false)

### Performance Tuning
- **WORKERS**: Number of parallel workers (empty = default from config)
- **RETRIES**: Number of retries for failed tests (empty = default from config)

### Additional Options
- **UPDATE_SNAPSHOTS**: Update visual snapshots during test run (default: false)
- **GREP**: Run tests matching specific pattern, e.g., "@smoke" (empty = all tests)
- **ENVIRONMENT**: Target environment - production, staging, or development
- **GENERATE_TRACE**: Generate trace files for all tests (default: false)

## Setting Up the Jenkins Job

### Option 1: Pipeline from SCM (Recommended)
1. Create a new Pipeline job in Jenkins
2. Under **Pipeline** section, select **Pipeline script from SCM**
3. Choose **Git** as SCM
4. Enter repository URL: `https://github.com/qascript20/playwright-mcp-demo.git`
5. Set **Branch Specifier**: `*/main`
6. Set **Script Path**: `jenkins/Jenkinsfile` (or `jenkins/Jenkinsfile.parameterized`)
7. Save and build

**Note**: After the first build, the parameters will be available on subsequent builds via "Build with Parameters"

### Option 2: Direct Pipeline Script
1. Create a new Pipeline job in Jenkins
2. Under **Pipeline** section, select **Pipeline script**
3. Copy the contents of `Jenkinsfile` into the script editor
4. Save and build

## Using Build Parameters

After the initial build, you can use "Build with Parameters" to customize test execution:

### Example 1: Run only Chromium tests
- Browser: `chromium`
- Test Suite: `all`
- Other parameters: default

### Example 2: Run smoke tests on all browsers
- Browser: `all`
- Test Suite: `all`
- Grep: `@smoke`

### Example 3: Debug specific test suite
- Browser: `chromium`
- Test Suite: `login`
- Debug Mode: `true`
- Headed Mode: `true`

### Example 4: Run with custom workers
- Browser: `all`
- Test Suite: `all`
- Workers: `2`
- Retries: `3`

## Environment Variables

The pipeline sets the following environment variables:
- `CI=true` - Enables CI mode (affects retries and workers in playwright.config.js)
- `HOME=${WORKSPACE}` - Sets home directory for browser installation
- `PLAYWRIGHT_BROWSERS_PATH=${WORKSPACE}/ms-playwright` - Custom browser installation path

## Test Execution

### With Build Parameters (Recommended)
Use "Build with Parameters" to customize test execution without modifying the pipeline:

**Quick Smoke Tests:**
- Browser: `chromium`
- Grep: `@smoke`
- Workers: `4`

**Full Regression:**
- Browser: `all`
- Test Suite: `all`
- Retries: `2`

**Debugging Failed Tests:**
- Browser: `chromium`
- Test Suite: `login`
- Headed Mode: `✓`
- Debug Mode: `✓`

### Without Parameters (Legacy)
For non-parameterized pipelines, tests run with default settings:
```bash
npm run test
```

### Manual Command Customization
To run specific tests in non-parameterized pipelines, modify the "Run Playwright Tests" stage:

```groovy
// Run only booking tests
sh 'npm run test:booking'

// Run only on Chromium
sh 'npm run test:chromium'

// Run specific test file
sh 'npx playwright test tests/login.spec.ts'
```

## Parallel Execution

To run tests in parallel across multiple browsers, modify the stage:

```groovy
stage('Run Playwright Tests') {
    parallel {
        stage('Chromium') {
            steps {
                sh 'npm run test:chromium'
            }
        }
        stage('Firefox') {
            steps {
                sh 'npm run test:firefox'
            }
        }
        stage('WebKit') {
            steps {
                sh 'npm run test:webkit'
            }
        }
    }
}
```

## Reports and Artifacts

The pipeline automatically publishes:

1. **JUnit XML Report**: `test-results/results.xml`
   - View in Jenkins Test Results
   - Shows pass/fail statistics and trends

2. **HTML Report**: `playwright-report/index.html`
   - Interactive Playwright HTML report
   - Accessible via "Playwright Test Report" link in build

3. **Test Artifacts**: `test-results/**/*`
   - Screenshots, videos, traces
   - Archived for debugging failures

## Troubleshooting

### Browser Installation Failures
If browsers fail to install, ensure the Jenkins agent has:
- Required system dependencies installed
- Sufficient disk space
- Internet connectivity

For Ubuntu/Debian, you may need to install dependencies manually:
```bash
npx playwright install-deps
```

### Permission Issues
If you encounter permission errors, ensure Jenkins user has:
- Write access to workspace directory
- Permission to install system packages (for browser dependencies)

### Memory Issues
If tests fail with memory errors:
1. Increase Jenkins agent memory
2. Reduce parallel workers in `playwright.config.js`
3. Run fewer projects simultaneously

### Timeout Issues
For slow tests, increase timeout in `playwright.config.js`:
```javascript
timeout: 60000, // 60 seconds per test
```

## Advanced Configuration

### Running on Docker Agents
Add Docker agent configuration:
```groovy
agent {
    docker {
        image 'mcr.microsoft.com/playwright:v1.55.1-jammy'
        args '-u root:root'
    }
}
```

### Webhook Triggers
Enable automatic builds on Git push:
1. Go to job configuration
2. Under **Build Triggers**, enable **GitHub hook trigger for GITScm polling**
3. Configure webhook in GitHub repository settings

### Scheduled Builds
Add cron schedule in Jenkinsfile:
```groovy
triggers {
    cron('H 2 * * *') // Run daily at 2 AM
}
```

### Notifications
Add email notifications in `post` section:
```groovy
post {
    failure {
        emailext (
            subject: "Build Failed: ${env.JOB_NAME} - ${env.BUILD_NUMBER}",
            body: "Test execution failed. Check ${env.BUILD_URL}",
            to: "team@example.com"
        )
    }
}
```

## Best Practices

1. **Use `npm ci`** instead of `npm install` for deterministic builds
2. **Enable CI mode** in playwright.config.js for retries and parallel execution
3. **Archive artifacts** for debugging failed tests
4. **Publish reports** for visibility into test results
5. **Clean workspace** after build to save disk space
6. **Use declarative pipeline** for better readability and maintainability

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Jenkins Pipeline Syntax](https://www.jenkins.io/doc/book/pipeline/syntax/)
- [Playwright CI Guide](https://playwright.dev/docs/ci)
- [NodeJS Plugin Documentation](https://plugins.jenkins.io/nodejs/)
