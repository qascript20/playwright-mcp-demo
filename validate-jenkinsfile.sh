#!/bin/bash

# Quick Jenkinsfile Syntax Validator
# This script performs basic validation of the Jenkinsfile without running the full pipeline

echo "🔍 Quick Jenkinsfile Validation"
echo "==============================="

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_status() { echo -e "${GREEN}✅ $1${NC}"; }
print_error() { echo -e "${RED}❌ $1${NC}"; }
print_warning() { echo -e "${YELLOW}⚠️ $1${NC}"; }

# 1. Check if Jenkinsfile exists
if [ ! -f "Jenkinsfile" ]; then
    print_error "Jenkinsfile not found in current directory"
    exit 1
fi
print_status "Jenkinsfile found"

# 2. Basic syntax check using groovy (if available)
if command -v groovy >/dev/null 2>&1; then
    echo "Checking Groovy syntax..."
    if groovy -e "evaluate(new File('Jenkinsfile'))" >/dev/null 2>&1; then
        print_status "Basic Groovy syntax is valid"
    else
        print_error "Groovy syntax errors detected"
        groovy -e "evaluate(new File('Jenkinsfile'))"
    fi
else
    print_warning "Groovy not available - skipping syntax check"
fi

# 3. Check for common pipeline structure
echo "Validating pipeline structure..."

required_sections=("pipeline" "agent" "stages" "post")
for section in "${required_sections[@]}"; do
    if grep -q "^\s*$section" Jenkinsfile; then
        print_status "$section section found"
    else
        print_error "$section section missing"
    fi
done

# 4. Check for required stages based on our Jenkinsfile
required_stages=("Checkout" "Setup Environment" "Install Dependencies" "Run Tests")
for stage in "${required_stages[@]}"; do
    if grep -q "stage('$stage')" Jenkinsfile; then
        print_status "Stage '$stage' found"
    else
        print_warning "Stage '$stage' not found (may be renamed)"
    fi
done

# 5. Check for Docker configuration
if grep -q "docker" Jenkinsfile; then
    print_status "Docker configuration found"
    
    # Check for the specific image
    if grep -q "mcr.microsoft.com/playwright" Jenkinsfile; then
        print_status "Playwright Docker image specified"
    else
        print_warning "Custom Docker image - ensure it has Playwright"
    fi
else
    print_warning "No Docker configuration found"
fi

# 6. Check for parameters
if grep -q "parameters" Jenkinsfile; then
    print_status "Build parameters defined"
    
    params=("BROWSER" "TEST_SUITE" "HEADED_MODE" "GREP_PATTERN")
    for param in "${params[@]}"; do
        if grep -q "$param" Jenkinsfile; then
            echo "  ✓ $param parameter found"
        else
            echo "  ⚠ $param parameter missing"
        fi
    done
else
    print_warning "No build parameters defined"
fi

# 7. Check post conditions
post_conditions=("always" "success" "failure")
for condition in "${post_conditions[@]}"; do
    if grep -q "$condition" Jenkinsfile; then
        print_status "Post condition '$condition' found"
    else
        print_warning "Post condition '$condition' missing"
    fi
done

# 8. Check for potential issues
echo "Checking for potential issues..."

# Check for node blocks in post (should be fixed now)
if grep -A 5 "post" Jenkinsfile | grep -q "node {"; then
    print_error "Found 'node {' blocks in post conditions - this may cause errors"
else
    print_status "No problematic 'node' blocks in post conditions"
fi

# Check for shell commands outside of sh blocks
if grep -q "docker run" Jenkinsfile && ! grep -q "sh.*docker run" Jenkinsfile; then
    print_warning "Direct docker commands found - ensure they're in sh blocks"
fi

# 9. Environment check
echo "Checking environment requirements..."

if command -v docker >/dev/null 2>&1; then
    print_status "Docker is available for testing"
    
    # Test if we can access docker
    if docker info >/dev/null 2>&1; then
        print_status "Docker daemon is accessible"
    else
        print_error "Docker daemon not accessible - check permissions"
    fi
else
    print_error "Docker not found - required for this Jenkinsfile"
fi

echo ""
echo "🎯 Validation Summary:"
echo "======================"
print_status "Jenkinsfile validation completed"

if command -v docker >/dev/null 2>&1 && docker info >/dev/null 2>&1; then
    echo ""
    echo "✨ Ready to test! Run: ./test-jenkinsfile.sh"
else
    echo ""
    print_warning "Fix Docker access before testing pipeline"
fi