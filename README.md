# Playwright Demo Project

This project demonstrates automated end-to-end testing using [Playwright](https://playwright.dev/), a modern testing framework for web applications.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Install browsers
npm run install-browsers

# Run tests with UI (interactive mode)
npm run test:ui

# Run all tests
npm test

# View test report
npm run report
```

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

### Local Development Setup

1. Clone the repository:
```bash
git clone https://github.com/qascript20/playwright-mcp-demo.git
cd "Playwright Demo"
```

2. Install Node.js dependencies:
```bash
npm install
```

3. Install Playwright browsers:
```bash
npm run install-browsers
```

4. (Optional) Install system dependencies for browsers:
```bash
npm run install-deps
```

### Quick Start

After installation, verify your setup:

```bash
# Run a quick test to verify everything works
npm run test:login

# View the test report
npm run report
```

### Troubleshooting

If you encounter issues:

1. **Browser installation problems:**
```bash
npm run install-deps
```

2. **Permission issues (macOS/Linux):**
```bash
sudo npm run install-deps
```

3. **Clear test artifacts:**
```bash
rm -rf test-results playwright-report
```

4. **Some tests fail on external sites:**
   - The booking.spec.ts tests may occasionally fail due to changes on booking.com
   - Login, checkout, and responsive tests should pass consistently as they test saucedemo.com
   - This is expected behavior when testing against live websites

## 📁 Project Structure

```
Playwright Demo/
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
├── playwright-report/         # HTML test reports (generated)
├── test-results/             # Test execution results and artifacts (generated)
├── playwright.config.js      # Playwright configuration
├── package.json              # Project dependencies and NPM scripts
└── README.md                 # This documentation file
```

**Key Files:**
- `playwright.config.js` - Main configuration for browsers, devices, and test settings
- `package.json` - Dependencies and convenient NPM scripts
- `tests/*.spec.ts` - Individual test suites for different functionalities

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

### Using NPM Scripts (Recommended)

#### Run all tests
```bash
npm test
```

#### Run tests with visual interface
```bash
npm run test:ui
```

#### Run tests in headed mode (visible browser)
```bash
npm run test:headed
```

#### Debug tests
```bash
npm run test:debug
```

#### Run tests in specific browsers
```bash
npm run test:chromium    # Chrome/Chromium
npm run test:firefox     # Firefox
npm run test:webkit      # Safari/WebKit
npm run test:mobile      # Mobile Chrome (Pixel 5)
```

#### Run specific test suites
```bash
npm run test:booking     # Flight booking tests
npm run test:login       # Login functionality tests
npm run test:checkout    # Checkout process tests
```

#### View test reports
```bash
npm run report
```

### Using Playwright CLI Directly

#### Run all tests
```bash
npx playwright test
```

#### Run a specific test file
```bash
npx playwright test booking.spec.ts
npx playwright test login.spec.ts
npx playwright test checkout.spec.ts
npx playwright test responsive-login.spec.ts
```

#### Run tests with specific options
```bash
npx playwright test --headed           # Visible browser
npx playwright test --debug            # Debug mode
npx playwright test --project=firefox  # Specific browser
npx playwright test --grep="login"     # Tests matching pattern
```

## 🌐 Browser Configuration

The project is configured to run tests across multiple browsers and devices:

- **Desktop Browsers:**
  - Chromium (Chrome)
  - Firefox
  - WebKit (Safari)

- **Mobile Devices:**
  - Pixel 5 (Mobile Chrome)
  - iPhone 12 (Mobile Safari)

**Current Configuration Details:**
- **Base URL**: `https://www.saucedemo.com`
- **Test Directory**: `./tests`
- **Output Directory**: `test-results`
- **Parallel Execution**: Enabled for faster test runs
- **Retries**: 2 retries on CI, 0 locally
- **Tracing**: Enabled on first retry for debugging
- **Workers**: 1 on CI, unlimited locally

Configuration can be customized in `playwright.config.js`.

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

## 💻 Development Guide

### Local Development Workflow

1. **Start development with UI mode** (recommended for test development):
```bash
npm run test:ui
```

2. **Debug failing tests:**
```bash
npm run test:debug
```

3. **Run tests in headed mode** to see browser actions:
```bash
npm run test:headed
```

4. **Check test results:**
```bash
npm run report
```

### Available NPM Scripts

| Script | Description |
|--------|-------------|
| `npm test` | Run all tests headlessly |
| `npm run test:ui` | Open Playwright UI for interactive testing |
| `npm run test:headed` | Run tests with visible browser |
| `npm run test:debug` | Run tests in debug mode |
| `npm run test:chromium` | Run tests only in Chrome |
| `npm run test:firefox` | Run tests only in Firefox |
| `npm run test:webkit` | Run tests only in Safari |
| `npm run test:mobile` | Run tests on mobile Chrome |
| `npm run test:booking` | Run only booking tests |
| `npm run test:login` | Run only login tests |
| `npm run test:checkout` | Run only checkout tests |
| `npm run report` | View HTML test report |
| `npm run install-browsers` | Install Playwright browsers |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Write tests following the existing patterns
4. Test your changes: `npm test`
5. Ensure all tests pass locally
6. Submit a pull request

### Test Writing Guidelines

- Use descriptive test names that explain the expected behavior
- Follow the Arrange-Act-Assert pattern
- Add proper waits for dynamic content using `expect()` assertions
- Use `page.getByRole()`, `page.getByText()`, or `page.getByTestId()` for reliable selectors
- Include error handling and retry logic for flaky elements
- Test on multiple browsers when possible

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