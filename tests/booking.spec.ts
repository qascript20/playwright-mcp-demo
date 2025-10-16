import { test, expect } from '@playwright/test';

test('Book a one-way flight from London to Paris', async ({ page }) => {
  // Navigate to Booking.com
  await page.goto('https://www.booking.com/index.en-gb.html?label=gen173nr-10CAEoggI46AdIM1gEaFCIAQGYATO4AQfIAQzYAQPoAQH4AQGIAgGoAgG4ApC2o8cGwAIB0gIkZGE1MzI4NGItZTU4ZS00ZmJiLWFmNDYtMzI0YjQ0NmIyNjU22AIB4AIB&sid=60af698fedf7c523021332b1c182971e&keep_landing=1&sb_price_type=total&');
  
  // Accept cookies if present
  const acceptButton = page.getByRole('button', { name: 'Accept' });
  if (await acceptButton.isVisible()) {
    await acceptButton.click();
  }
  
  // Navigate to Flights section
  await page.getByRole('link', { name: 'Flights' }).click();
  await page.waitForLoadState('networkidle');
  
  // Select one-way option
  await page.locator('label').filter({ hasText: 'One way' }).locator('span').nth(1).click();
  
  // Select departure airport (London)
  await page.getByRole('button', { name: 'Leaving from' }).click();
  await page.locator('input[type="text"]').fill('London');
  await page.getByText('LHR London Heathrow Airport').click();
  
  // Select destination airport (Paris)
  await page.getByRole('button', { name: 'Going to' }).click();
  await page.locator('input[type="text"]').fill('Paris');
  await page.getByText('CDG Paris - Charles de Gaulle').click();
  
  // Perform search
  await page.getByRole('button', { name: 'Search' }).click();
  
  // Wait for search results to load
  await page.waitForLoadState('networkidle');
  await page.waitForSelector('#flight-card-0', { timeout: 30000 });
  
  // Verify flight results contain correct airports
  await expect(page.locator('#flight-card-0')).toContainText('LHR');
  await expect(page.locator('#flight-card-0')).toContainText('CDG');
  
  // Select the first flight
  await page.locator('#flight-card-0').getByTestId('flight_card_bound_select_flight').click();
  
  // Verify we're on the booking page
  await page.waitForSelector('[data-testid="timeline_segment_title"]', { timeout: 10000 });
  await expect(page.getByTestId('timeline_segment_title').getByRole('heading')).toContainText('Flight to Paris');
  
  // Continue with booking
  await page.getByRole('button', { name: 'Continue' }).click();
});