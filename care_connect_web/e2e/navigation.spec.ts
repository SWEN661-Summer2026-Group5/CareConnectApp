import { expect, test } from '@playwright/test';

test.describe('Keyboard navigation', () => {
  test('Tab moves through the login form in visual order', async ({ page }) => {
    await page.goto('/');

    const email = page.getByLabel(/^Email Address/);
    const password = page.getByLabel(/^Password/);

    // Focus starts on the email field, then Tab walks the form: password, the
    // show/hide toggle, Sign In, and finally the Forgot Password link.
    await email.focus();
    await expect(email).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(password).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: 'Show password' })).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: 'Sign In', exact: true })).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: 'Forgot Password?' })).toBeFocused();
  });

  test('Shift+Tab walks back up the form', async ({ page }) => {
    await page.goto('/');

    const password = page.getByLabel(/^Password/);
    await password.focus();

    await page.keyboard.press('Shift+Tab');
    await expect(page.getByLabel(/^Email Address/)).toBeFocused();
  });

  test('the skip link is the first stop and jumps to main content', async ({ page }) => {
    await page.goto('/');

    await page.keyboard.press('Tab');
    const skip = page.getByRole('link', { name: 'Skip to main content' });
    await expect(skip).toBeFocused();

    await skip.press('Enter');
    await expect(page).toHaveURL(/#main-content$/);
  });
});
