pipeline {
    agent {
        docker {
            image 'mcr.microsoft.com/playwright:v1.55.1-focal'
            args '--user root -v /var/run/docker.sock:/var/run/docker.sock --privileged'
            // Add this to ensure Docker is available
            reuseNode true
        }
    }
    
    environment {
        NODE_VERSION = '18'
        HOME = '/tmp'
        PLAYWRIGHT_BROWSERS_PATH = '/ms-playwright'
    }
    
    options {
        // Keep builds for 30 days
        buildDiscarder(logRotator(daysToKeepStr: '30', numToKeepStr: '50'))
        
        // Timeout the build after 30 minutes
        timeout(time: 30, unit: 'MINUTES')
        
        // Retry the build up to 2 times on failure
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
                timestamps {
                    script {
                        echo "🔄 Checking out code from ${env.BRANCH_NAME}"
                    }
                    checkout scm
                }
            }
        }
        
        stage('Setup Environment') {
            steps {
                timestamps {
                    script {
                        echo "🐳 Setting up Docker environment with Playwright"
                    }
                    sh '''
                        echo "Docker Environment Info:"
                        echo "Operating System: $(uname -a)"
                        echo "Node.js Version: $(node --version)"
                        echo "NPM Version: $(npm --version)"
                        echo "Playwright Version: $(npx playwright --version)"
                        echo "Available Browsers:"
                        ls -la /ms-playwright/ || echo "Browser directory not found"
                        echo "CPU Info: $(nproc) cores"
                        echo "Memory Info: $(free -h | grep '^Mem' || echo 'N/A')"
                    '''
                }
            }
        }
        
        stage('Install Dependencies') {
            steps {
                timestamps {
                    script {
                        echo "📚 Installing npm dependencies"
                    }
                    sh '''
                        # Clean install for consistent builds
                        npm ci
                        
                        # Verify installation
                        npm list --depth=0
                    '''
                }
            }
        }
        
        stage('Verify Playwright Setup') {
            steps {
                timestamps {
                    script {
                        echo "🌐 Verifying Playwright browser installation"
                    }
                    sh '''
                        # Verify browsers are available
                        echo "Checking Playwright browsers..."
                        npx playwright install --dry-run || true
                        
                        # List available browsers
                        echo "Available browsers in container:"
                        find /ms-playwright -name "*chrome*" -o -name "*firefox*" -o -name "*webkit*" | head -10 || echo "Browser binaries not found in expected location"
                        
                        # Test browser launch (headless)
                        echo "Testing browser launch..."
                        timeout 30s npx playwright test --browser=chromium --list || echo "Browser test failed or no tests found"
                    '''
                }
            }
        }
        
        stage('Run Tests') {
            steps {
                timestamps {
                    script {
                        echo "🧪 Running Playwright tests in Docker container"
                        
                        // Build test command based on parameters
                        def testCommand = "npx playwright test"
                        
                        // Add browser selection
                        if (params.BROWSER != 'all') {
                            testCommand += " --project=${params.BROWSER}"
                        }
                        
                        // Add test suite selection
                        if (params.TEST_SUITE != 'all') {
                            testCommand += " ${params.TEST_SUITE}.spec.ts"
                        }
                        
                        // Add grep pattern if specified
                        if (params.GREP_PATTERN) {
                            testCommand += " --grep='${params.GREP_PATTERN}'"
                        }
                        
                        // Note: Headed mode not supported in Docker without X11
                        if (params.HEADED_MODE) {
                            echo "⚠️ Headed mode not supported in Docker environment. Running in headless mode."
                        }
                        
                        // Add CI-specific options
                        testCommand += " --reporter=html,junit"
                        
                        echo "Executing: ${testCommand}"
                    }
                    
                    // Set CI environment variables
                    withEnv(['CI=true', 'PLAYWRIGHT_HTML_REPORT=playwright-report']) {
                        sh """
                            # Create reports directory
                            mkdir -p test-results
                            mkdir -p playwright-report
                            
                            # Build test command
                            TEST_CMD="npx playwright test"
                            
                            # Add browser selection
                            if [ "${params.BROWSER}" != "all" ]; then
                                TEST_CMD="\$TEST_CMD --project=${params.BROWSER}"
                            fi
                            
                            # Add test suite selection
                            if [ "${params.TEST_SUITE}" != "all" ]; then
                                TEST_CMD="\$TEST_CMD ${params.TEST_SUITE}.spec.ts"
                            fi
                            
                            # Add grep pattern if specified
                            if [ -n "${params.GREP_PATTERN}" ]; then
                                TEST_CMD="\$TEST_CMD --grep='${params.GREP_PATTERN}'"
                            fi
                            
                            # Add reporter and output directory
                            TEST_CMD="\$TEST_CMD --reporter=html,junit --output-dir=test-results"
                            
                            echo "Executing: \$TEST_CMD"
                            
                            # Run the tests
                            eval "\$TEST_CMD" || true
                        """
                    }
                }
            }
        }
        
        stage('Generate Reports') {
            steps {
                timestamps {
                    script {
                        echo "📊 Processing test reports"
                    }
                    
                    // Publish JUnit test results
                    publishTestResults testResultsPattern: 'test-results/results.xml'
                    
                    // Archive HTML report
                    publishHTML([
                        allowMissing: false,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'playwright-report',
                        reportFiles: 'index.html',
                        reportName: 'Playwright Test Report',
                        reportTitles: 'Playwright Test Results'
                    ])
                    
                    // Archive test artifacts
                    archiveArtifacts artifacts: 'test-results/**/*', allowEmptyArchive: true
                    archiveArtifacts artifacts: 'playwright-report/**/*', allowEmptyArchive: true
                }
            }
        }
    }
    
    post {
        always {
            node {
                script {
                    echo "🧹 Cleaning up Docker environment"
                }
                
                // Clean up large files but keep reports
                sh '''
                    # Remove node_modules to save space (keep for failed builds debugging)
                    if [ "${BUILD_RESULT:-UNKNOWN}" = "SUCCESS" ]; then
                        rm -rf node_modules || true
                    fi
                    
                    # Clean up temporary files
                    rm -rf /tmp/.X* /tmp/core* || true
                '''
            }
        }
        
        success {
            script {
                echo "✅ Pipeline completed successfully!"
            }
            
            // Send success notification (configure as needed)
            // slackSend(
            //     channel: '#test-results',
            //     color: 'good',
            //     message: "✅ Playwright tests passed for ${env.JOB_NAME} #${env.BUILD_NUMBER}"
            // )
        }
        
        failure {
            node {
                script {
                    echo "❌ Pipeline failed!"
                }
                
                // Capture additional debug information
                sh '''
                    echo "=== Docker Environment Debug ==="
                    df -h || true
                    free -h || true
                    ps aux | head -20 || true
                    
                    echo "=== Playwright Debug ==="
                    find . -name "*.log" -o -name "*error*" | head -10 | xargs cat || true
                    
                    echo "=== Container Info ==="
                    cat /etc/os-release || true
                    which node npm npx || true
                '''
            }
            
            // Send failure notification (configure as needed)
            // slackSend(
            //     channel: '#test-results',
            //     color: 'danger',
            //     message: "❌ Playwright tests failed for ${env.JOB_NAME} #${env.BUILD_NUMBER}\nCheck: ${env.BUILD_URL}"
            // )
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