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
- [Contributing](#contributing)

## 🎯 Overview

This repository contains automated tests for various web applications including:
- **Booking.com** - Flight booking functionality
- **SauceDemo** - E-commerce login, checkout, and responsive testing

The tests are written in TypeScript and utilize Playwright's cross-browser testing capabilities.

## 🛠 Prerequisites

Before running the tests, ensure you have the following installed:

- **Node.js** (version 18 or higher)
- **npm** or **yarn**

## 📦 Installation

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