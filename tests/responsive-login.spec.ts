import { test, expect } from '@playwright/test';

// Viewport configurations for responsive testing
const viewports = {
  mobile: { width: 375, height: 667 },    // iPhone SE
  tablet: { width: 768, height: 1024 },   // iPad
  desktop: { width: 1920, height: 1080 }, // Full HD
};

test.describe('Responsive Login Tests', () => {
  // Test for each viewport size
  for (const [device, viewport] of Object.entries(viewports)) {
    test(`should login successfully on ${device}`, async ({ page }) => {
      // Set viewport size for the test
      await page.setViewportSize(viewport);

      // Navigate to the website
      await page.goto('https://www.saucedemo.com/');

      // Verify responsive elements are visible
      await expect(page.getByRole('textbox', { name: 'Username' })).toBeVisible();
      await expect(page.getByRole('textbox', { name: 'Password' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();

      // Fill in login credentials
      await page.getByRole('textbox', { name: 'Username' }).fill('standard_user');
      await page.getByRole('textbox', { name: 'Password' }).fill('secret_sauce');
      
      // Click the login button
      await page.getByRole('button', { name: 'Login' }).click();
      
      // Verify successful login by checking URL and product listing
      await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
      await expect(page.getByText('Products')).toBeVisible();

      // Additional responsive checks
      if (device === 'mobile') {
        // Check if burger menu is present on mobile
        const burgerMenu = page.locator('#react-burger-menu-btn');
        await expect(burgerMenu).toBeVisible();
      }
    });
  }
});