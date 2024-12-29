import { test, expect } from '@playwright/test';

test('User can login and see dashboard', async ({ page }) => {
  await page.goto('http://localhost:5173/login');
  await page.fill('#emailInput', 'testUser@test.com');
  await page.fill('#passwordInput', 'testPassword123');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL('/dashboard');
});
