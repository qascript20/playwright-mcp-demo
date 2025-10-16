import { test, expect } from '@playwright/test';

test.describe('Sauce Demo Shopping', () => {
  test('should login and add item to cart', async ({ page }) => {
    // Navigate to the website
    await page.goto('https://www.saucedemo.com/');

    // Fill in login credentials
    await page.getByRole('textbox', { name: 'Username' }).fill('standard_user');
    await page.getByRole('textbox', { name: 'Password' }).fill('secret_sauce');
    
    // Click the login button
    await page.getByRole('button', { name: 'Login' }).click();
    
    // Verify successful login by checking URL and product listing
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    await expect(page.getByText('Products')).toBeVisible();

    // Add Sauce Labs Bike Light to cart
    await page.getByRole('button', { name: 'Add to cart', exact: true }).first().click();
    
    // Verify item was added to cart
    const cartBadge = page.locator('.shopping_cart_badge');
    await expect(cartBadge).toBeVisible();
    await expect(cartBadge).toHaveText('1');
  });
});