# Playwright Demo Project

This project demonstrates automated end-to-end testing using [Playwright](https://playwright.dev/), a modern testing framework for web applications.

## 📋 Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Available Tests](#available-tests)
- [Running Tests](#running-tests)
- [Browser Configuration](#browser-configuration)
- [Test Reports](#test-reports)
- [CI/CD with Jenkins](#cicd-with-jenkins)
- [Contributing](#contributing)

## 🎯 Overview

This repository contains automated tests for various web applications including:
- **Booking.com** - Flight booking functionality
- **SauceDemo** - E-commerce login, checkout, and responsive testing

The tests are written in TypeScript and utilize Playwright's cross-browser testing capabilities.

## 🛠 Prerequisites

### For Local Development:
- **Node.js** (version 18 or higher)
- **npm** or **yarn**

### For Jenkins CI/CD:
- **Docker** (required on Jenkins server/agents)
- **Jenkins** with Docker Pipeline plugin

### Optional (for Docker testing locally):
- **Docker Desktop** (if you want to test the Jenkins environment locally)

## 📦 Installation

### Local Development Setup (No Docker Required)

1. Clone the repository:
```bash
git clone <repository-url>
cd "Playwright Demo"
```

2. Install dependencies:
```bash
npm install
```

3. Install Playwright browsers:
```bash
npx playwright install
```

### Optional: Docker Testing Setup

If you want to test the same environment as Jenkins locally:

1. Install Docker Desktop
2. Test the setup:
```bash
./test-docker-setup.sh
```

## 📁 Project Structure

```
playwright-demo/
├── tests/                     # Main test directory
│   ├── booking.spec.ts        # Flight booking tests (Booking.com)
│   ├── checkout.spec.ts       # E-commerce checkout tests
│   ├── login.spec.ts          # Login functionality tests
│   ├── responsive-login.spec.ts # Responsive design tests
│   └── generate-tests.prompt.md # Test generation guidelines
├── e2e/                       # Additional E2E tests
│   └── example.spec.ts        # Example test file
├── tests-examples/            # Example tests from Playwright
│   └── demo-todo-app.spec.ts  # Todo app demo tests
├── playwright-report/         # HTML test reports
├── test-results/             # Test execution results and artifacts
├── playwright.config.js      # Playwright configuration
└── package.json              # Project dependencies and scripts
```

## 🧪 Available Tests

### Booking Tests (`booking.spec.ts`)
- **Flight Booking**: Tests one-way flight booking from London to Paris
- Covers airport selection, search functionality, and booking flow

### Login Tests (`login.spec.ts`)
- User authentication testing
- Valid/invalid credential scenarios

### Checkout Tests (`checkout.spec.ts`)
- E-commerce purchase flow
- Cart management and payment process

### Responsive Tests (`responsive-login.spec.ts`)
- Mobile and desktop viewport testing
- Responsive design validation

## 🚀 Running Tests

### Run all tests
```bash
npx playwright test
```

### Run a specific test file
```bash
npx playwright test booking.spec.ts
```

### Run tests in headed mode (visible browser)
```bash
npx playwright test --headed
```

### Run tests in a specific browser
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Run tests with debug mode
```bash
npx playwright test --debug
```

### Run tests on mobile devices
```bash
npx playwright test --project=mobile-chrome
```

## 🌐 Browser Configuration

The project is configured to run tests across multiple browsers and devices:

- **Desktop Browsers:**
  - Chromium (Chrome)
  - Firefox
  - WebKit (Safari)

- **Mobile Devices:**
  - Pixel 5 (Mobile Chrome)

Configuration details can be found in `playwright.config.js`.

## 📊 Test Reports

After running tests, view the HTML report:

```bash
npx playwright show-report
```

The report includes:
- Test execution results
- Screenshots and videos of failures
- Trace files for debugging
- Performance metrics

## 🚀 CI/CD with Jenkins

This project includes a comprehensive Jenkinsfile that uses the official Playwright Docker image for consistent, reliable test execution in CI environments.

### Jenkins Setup

The pipeline uses the official Playwright Docker image: `mcr.microsoft.com/playwright:v1.55.1-focal`

**Key Features:**
- **Docker-based execution** for consistent environment
- **Parameterized builds** with browser and test suite selection
- **Parallel execution** capabilities
- **Comprehensive reporting** with HTML and JUnit formats
- **Artifact archiving** for debugging failed tests

**Pipeline Parameters:**
- `BROWSER`: Choose browser (all, chromium, firefox, webkit, mobile-chrome)
- `TEST_SUITE`: Select test suite (all, booking, login, checkout, responsive)
- `HEADED_MODE`: Run in headed mode (disabled in Docker)
- `GREP_PATTERN`: Run tests matching specific patterns

**Required Jenkins Plugins:**
- Docker Pipeline Plugin
- HTML Publisher Plugin
- JUnit Plugin
- Pipeline Plugin

**Jenkins Configuration:**
1. Ensure Docker is available on Jenkins agents
2. Create a new Pipeline job
3. Point to your repository containing the Jenkinsfile
4. Configure build parameters as needed

The pipeline automatically:
- Sets up the Playwright environment
- Installs dependencies
- Runs tests based on parameters
- Generates HTML and JUnit reports
- Archives test artifacts and traces

## 🔧 Configuration Options

Key configuration options in `playwright.config.js`:

- **Parallel Execution**: Tests run in parallel for faster execution
- **Retries**: Automatic retry on CI (2 retries) for flaky tests
- **Tracing**: Enabled on first retry for debugging
- **Base URL**: Default base URL for SauceDemo tests
- **Reporter**: HTML reporter for detailed test results

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Write tests following the existing patterns
4. Ensure all tests pass: `npm test`
5. Submit a pull request

### Test Writing Guidelines

- Use descriptive test names that explain the expected behavior
- Follow the Arrange-Act-Assert pattern
- Add proper waits for dynamic content
- Use data-testid attributes when possible for stable selectors
- Include error handling for flaky elements

## 📝 Notes

- Tests are configured with automatic retries on CI environments
- Trace files are generated on first retry for debugging failed tests
- The project supports both desktop and mobile testing scenarios
- All tests use TypeScript for better type safety and IDE support

## 🔗 Useful Links

- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Playwright API Reference](https://playwright.dev/docs/api/class-playwright)
- [Best Practices](https://playwright.dev/docs/best-practices)

---

For questions or issues, please open an issue in the repository.