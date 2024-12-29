import { test, expect } from '@playwright/test';

test('User can login and see dashboard', async ({ page }) => {
  // Przechodzimy na stronę logowania
  await page.goto('http://localhost:5173/login');

  // Wypełniamy formularz logowania
  await page.fill('#emailInput', 'testUser@test.com');
  await page.fill('#passwordInput', 'testPassword123');

  // Klikamy przycisk logowania
  await page.click('button[type="submit"]');

  // Oczekujemy, że po zalogowaniu zostanie przekierowany na stronę dashboardu
  await expect(page).toHaveURL('/dashboard');

  // Sprawdzamy, czy na stronie pojawił się nagłówek powitalny
//   await expect(page.locator('h1')).toContainText('Welcome');
});
