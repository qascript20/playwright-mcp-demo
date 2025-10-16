pipeline {
    agent any
    
    tools {
        nodejs 'Node-18'  // Requires NodeJS plugin and Node-18 configured in Global Tool Configuration
    }
    
    environment {
        CI = 'true'
        PLAYWRIGHT_HTML_REPORT = 'playwright-report'
    }
    
    options {
        buildDiscarder(logRotator(daysToKeepStr: '30', numToKeepStr: '50'))
        timeout(time: 30, unit: 'MINUTES')
        retry(2)
    }
    
    parameters {
        choice(
            name: 'BROWSER',
            choices: ['all', 'chromium', 'firefox', 'webkit', 'mobile-chrome'],
            description: 'Select browser to run tests on'
        )
        choice(
            name: 'TEST_SUITE',
            choices: ['all', 'booking', 'login', 'checkout', 'responsive'],
            description: 'Select test suite to run'
        )
        booleanParam(
            name: 'HEADED_MODE',
            defaultValue: false,
            description: 'Run tests in headed mode (visible browser)'
        )
        string(
            name: 'GREP_PATTERN',
            defaultValue: '',
            description: 'Run tests matching this pattern (optional)'
        )
    }
    
    stages {
        stage('Checkout') {
            steps {
                script {
                    echo "🔄 Checking out code from ${env.BRANCH_NAME}"
                }
                checkout scm
            }
        }
        
        stage('Setup Environment') {
            steps {
                script {
                    echo "🔧 Setting up Node.js environment for Playwright"
                }
                sh '''
                    echo "Build Environment Info:"
                    echo "Operating System: $(uname -a)"
                    echo "Node.js Version: $(node --version)"
                    echo "NPM Version: $(npm --version)"
                    echo "Working Directory: $(pwd)"
                    echo "User: $(whoami)"
                    echo "CPU Info: $(nproc 2>/dev/null || sysctl -n hw.ncpu 2>/dev/null || echo 'Unknown')"
                '''
            }
        }
        
        stage('Install Dependencies') {
            steps {
                script {
                    echo "📚 Installing npm dependencies"
                }
                sh '''
                    npm ci
                    npm list --depth=0
                '''
            }
        }
        
        stage('Install Playwright Browsers') {
            steps {
                script {
                    echo "🌐 Installing Playwright browsers"
                }
                sh '''
                    echo "Installing Playwright browsers..."
                    npx playwright install
                    
                    echo "Playwright Version: $(npx playwright --version)"
                    echo "Available test files:"
                    npx playwright test --list || echo "No tests found or error listing tests"
                '''
            }
        }
        
        stage('Run Tests') {
            steps {
                script {
                    echo "🧪 Running Playwright tests"
                    
                    def testCommand = "npx playwright test"
                    
                    if (params.BROWSER != 'all') {
                        testCommand += " --project=${params.BROWSER}"
                    }
                    
                    if (params.TEST_SUITE != 'all') {
                        testCommand += " ${params.TEST_SUITE}.spec.ts"
                    }
                    
                    if (params.GREP_PATTERN) {
                        testCommand += " --grep='${params.GREP_PATTERN}'"
                    }
                    
                    if (params.HEADED_MODE) {
                        testCommand += " --headed"
                        echo "🖥️ Running tests in headed mode"
                    } else {
                        echo "🤖 Running tests in headless mode"
                    }
                    
                    testCommand += " --reporter=html,junit"
                    echo "Executing: ${testCommand}"
                }
                
                sh """
                    mkdir -p test-results
                    mkdir -p playwright-report
                    
                    TEST_CMD="npx playwright test"
                    
                    if [ "${params.BROWSER}" != "all" ]; then
                        TEST_CMD="\$TEST_CMD --project=${params.BROWSER}"
                    fi
                    
                    if [ "${params.TEST_SUITE}" != "all" ]; then
                        TEST_CMD="\$TEST_CMD ${params.TEST_SUITE}.spec.ts"
                    fi
                    
                    if [ -n "${params.GREP_PATTERN}" ]; then
                        TEST_CMD="\$TEST_CMD --grep='${params.GREP_PATTERN}'"
                    fi
                    
                    if [ "${params.HEADED_MODE}" = "true" ]; then
                        TEST_CMD="\$TEST_CMD --headed"
                    fi
                    
                    TEST_CMD="\$TEST_CMD --reporter=html,junit --output-dir=test-results"
                    
                    echo "Final command: \$TEST_CMD"
                    
                    set +e
                    eval "\$TEST_CMD"
                    TEST_EXIT_CODE=\$?
                    set -e
                    
                    echo "Tests completed with exit code: \$TEST_EXIT_CODE"
                    ls -la test-results/ || echo "No test-results directory"
                    ls -la playwright-report/ || echo "No playwright-report directory"
                    
                    exit \$TEST_EXIT_CODE
                """
            }
        }
        
        stage('Generate Reports') {
            steps {
                script {
                    echo "📊 Processing test reports"
                    
                    def junitFile = 'test-results/results.xml'
                    if (fileExists(junitFile)) {
                        echo "Publishing JUnit test results..."
                        publishTestResults testResultsPattern: junitFile
                    } else {
                        echo "⚠️ JUnit results file not found: ${junitFile}"
                    }
                    
                    def htmlReportDir = 'playwright-report'
                    def htmlReportFile = "${htmlReportDir}/index.html"
                    if (fileExists(htmlReportFile)) {
                        echo "Publishing HTML test report..."
                        publishHTML([
                            allowMissing: false,
                            alwaysLinkToLastBuild: true,
                            keepAll: true,
                            reportDir: htmlReportDir,
                            reportFiles: 'index.html',
                            reportName: 'Playwright Test Report',
                            reportTitles: 'Playwright Test Results'
                        ])
                    } else {
                        echo "⚠️ HTML report not found: ${htmlReportFile}"
                    }
                    
                    echo "Archiving test artifacts..."
                    archiveArtifacts artifacts: 'test-results/**/*', allowEmptyArchive: true
                    archiveArtifacts artifacts: 'playwright-report/**/*', allowEmptyArchive: true
                    
                    sh '''
                        echo "=== Generated Test Artifacts ==="
                        find test-results -type f 2>/dev/null | head -20 || echo "No test-results files"
                        find playwright-report -type f 2>/dev/null | head -20 || echo "No playwright-report files"
                    '''
                }
            }
        }
    }
    
    post {
        always {
            script {
                echo "🧹 Cleaning up workspace"
                try {
                    sh '''
                        if [ "${BUILD_RESULT:-UNKNOWN}" = "SUCCESS" ]; then
                            echo "Removing node_modules to save space..."
                            rm -rf node_modules || true
                        else
                            echo "Keeping node_modules for debugging failed build"
                        fi
                        
                        rm -rf /tmp/.X* /tmp/core* 2>/dev/null || true
                        echo "Cleanup completed"
                    '''
                } catch (Exception e) {
                    echo "Cleanup failed: ${e.getMessage()}"
                }
            }
        }
        
        success {
            script {
                echo "✅ Pipeline completed successfully!"
            }
        }
        
        failure {
            script {
                echo "❌ Pipeline failed!"
                try {
                    sh '''
                        echo "=== Environment Debug ==="
                        echo "Node: ${NODE_NAME:-unknown}"
                        echo "Workspace: $(pwd)"
                        df -h . || true
                        
                        echo "=== System Resources ==="
                        free -h 2>/dev/null || echo "free command not available"
                        ps aux 2>/dev/null | head -20 || echo "ps command not available"
                        
                        echo "=== Playwright Debug ==="
                        find . -name "*.log" -o -name "*error*" 2>/dev/null | head -10 | xargs cat 2>/dev/null || echo "No error logs found"
                        
                        echo "=== Environment Info ==="
                        uname -a || true
                        which node npm npx 2>/dev/null || echo "Node tools location unknown"
                        
                        echo "=== Test Results Debug ==="
                        ls -la test-results/ 2>/dev/null || echo "No test-results directory"
                        ls -la playwright-report/ 2>/dev/null || echo "No playwright-report directory"
                    '''
                } catch (Exception e) {
                    echo "Debug information gathering failed: ${e.getMessage()}"
                }
            }
        }
        
        unstable {
            script {
                echo "⚠️ Pipeline is unstable (some tests failed)"
            }
        }
        
        aborted {
            script {
                echo "🛑 Pipeline was aborted"
            }
        }
    }
}