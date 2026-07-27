import { expect, test } from '@playwright/test';

test.describe('Sign in', () => {
  test('signs in and lands on the home screen', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();

    await page.getByLabel(/^Email Address/).fill('carer@example.com');
    await page.getByLabel(/^Password/).fill('hunter2');
    await page.getByRole('button', { name: 'Sign In', exact: true }).click();

    await expect(page).toHaveURL('/home');
    await expect(page.getByRole('heading', { name: 'Home', level: 1 })).toBeVisible();
  });

  test('shows Sign Out in the nav once authenticated', async ({ page }) => {
    await page.goto('/');

    await page.getByLabel(/^Email Address/).fill('carer@example.com');
    await page.getByLabel(/^Password/).fill('hunter2');
    await page.getByRole('button', { name: 'Sign In', exact: true }).click();

    await expect(page).toHaveURL('/home');
    await expect(page.getByRole('link', { name: 'Sign Out' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Sign In' })).toHaveCount(0);
  });

  test('refuses to sign in with empty credentials', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('button', { name: 'Sign In', exact: true }).click();

    await expect(page).toHaveURL('/');
    await expect(page.getByRole('alert')).toContainText(
      'Enter both your email address and password',
    );
  });
});
