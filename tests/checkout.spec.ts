import { test, expect } from '@playwright/test';

test.describe('Sauce Demo Shopping', () => {
  test('should complete checkout process', async ({ page }) => {
    // Navigate to the website
    await page.goto('https://www.saucedemo.com/');

    // Fill in login credentials
    await page.getByRole('textbox', { name: 'Username' }).fill('standard_user');
    await page.getByRole('textbox', { name: 'Password' }).fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();

    // Verify successful login
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');

    // Add Bike Light to cart
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();

    // Verify item was added to cart
    const cartBadge = page.locator('.shopping_cart_badge');
    await expect(cartBadge).toBeVisible();
    await expect(cartBadge).toHaveText('1');

    // Navigate to cart
    await page.locator('[data-test="shopping-cart-link"]').click();
    await expect(page).toHaveURL('https://www.saucedemo.com/cart.html');

    // Verify cart contents
    await expect(page.getByText('Sauce Labs Bike Light')).toBeVisible();
    await expect(page.getByText('$9.99')).toBeVisible();

    // Proceed to checkout
    await page.locator('[data-test="checkout"]').click();
    await expect(page).toHaveURL('https://www.saucedemo.com/checkout-step-one.html');

    // Fill checkout information
    await page.locator('[data-test="firstName"]').fill('John');
    await page.locator('[data-test="lastName"]').fill('Doe');
    await page.locator('[data-test="postalCode"]').fill('12345');
    await page.locator('[data-test="continue"]').click();

    // Verify checkout overview
    await expect(page).toHaveURL('https://www.saucedemo.com/checkout-step-two.html');
    await expect(page.getByText('Sauce Labs Bike Light')).toBeVisible();
    await expect(page.getByText('Payment Information:')).toBeVisible();
    await expect(page.getByText('Shipping Information:')).toBeVisible();
    await expect(page.locator('[data-test="finish"]')).toBeVisible();

    // Complete checkout
    await page.locator('[data-test="finish"]').click();
    
    // Verify order completion
    await expect(page).toHaveURL('https://www.saucedemo.com/checkout-complete.html');
    await expect(page.getByRole('heading', { name: 'Thank you for your order!' })).toBeVisible();
    await expect(page.getByText('Your order has been dispatched')).toBeVisible();
  });
});