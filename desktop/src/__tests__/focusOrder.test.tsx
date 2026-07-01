import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderApp } from '../test-support/renderApp';

// Collects the interactive elements in DOM (= tab) order, skipping anything
// removed from the sequence via tabindex="-1" (e.g. focus-target headings and
// the inactive roving menu-bar items).
function focusableLabels(container: HTMLElement): string[] {
  const nodes = container.querySelectorAll<HTMLElement>(
    'a[href], button:not([disabled]), input, textarea, [tabindex]',
  );
  return Array.from(nodes)
    .filter((el) => el.getAttribute('tabindex') !== '-1')
    .map(
      (el) =>
        el.getAttribute('aria-label') ||
        el.getAttribute('placeholder') ||
        el.textContent?.trim() ||
        '',
    );
}

async function signIn(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/^Email Address/), 'a@b.com');
  await user.type(screen.getByLabelText(/^Password/), 'secret');
  await user.click(screen.getByRole('button', { name: 'Sign In' }));
}

/** Asserts `expected` appears as an ordered (not necessarily contiguous) subsequence. */
function expectOrder(actual: string[], expected: string[]) {
  let cursor = -1;
  for (const label of expected) {
    const idx = actual.findIndex((a, i) => i > cursor && a.includes(label));
    expect(idx, `"${label}" should come after previous items in: ${actual.join(' | ')}`).toBeGreaterThan(cursor);
    cursor = idx;
  }
}

describe('focus order (§2)', () => {
  it('Login screen: Email, Password, Show/Hide, Sign In, Forgot Password', () => {
    const { container } = renderApp();
    expectOrder(focusableLabels(container), [
      'Enter your email',
      'Enter your password',
      'Show password',
      'Sign In',
      'Forgot Password',
    ]);
  });

  it('Home screen: menu bar, toolbar (New Task, Search, Settings), View Task, View All Tasks, MENU', async () => {
    const user = userEvent.setup();
    const { container } = renderApp();
    await signIn(user);

    expectOrder(focusableLabels(container), [
      'Skip to main content',
      'File', // menu bar: each top-level item is its own tab stop
      'Edit',
      'View',
      'Help',
      'New Task', // toolbar
      'Search tasks and contacts', // Search field
      'Settings', // toolbar
      'View Task', // Next Task card action
      'View All Tasks',
      'Open menu', // MENU button
    ]);
  });

  it('Task List screen: Add New Task, Sort, task cards, Completed toggle, MENU', async () => {
    const user = userEvent.setup();
    const { container } = renderApp();
    await signIn(user);
    await user.click(screen.getByRole('button', { name: 'View All Tasks' }));

    expectOrder(focusableLabels(container), [
      'New Task', // toolbar
      'Settings', // toolbar
      'Add New Task',
      'Sort tasks',
      'Take morning medication', // first task card
      'Completed',
      'Open menu', // MENU
    ]);
  });

  it('Task Detail screen: Mark as Resolved, MENU, Back', async () => {
    const user = userEvent.setup();
    const { container } = renderApp();
    await signIn(user);
    await user.click(screen.getByRole('button', { name: /View Task/ }));

    expectOrder(focusableLabels(container), [
      'New Task',
      'Settings',
      'Mark',
      'Open menu',
      'Back',
    ]);
  });

  it('Options screen: font sizes, contrasts, MENU', async () => {
    const user = userEvent.setup();
    const { container } = renderApp();
    await signIn(user);
    await user.click(screen.getByRole('button', { name: 'Open menu' }));
    await user.click(screen.getByRole('button', { name: 'Options' }));

    expectOrder(focusableLabels(container), [
      'Font size small',
      'Font size medium',
      'Font size large',
      'Font size extra large',
      'Contrast normal',
      'Contrast high',
      'Contrast extra high',
      'Open menu',
    ]);
  });

  it('Menu screen: Home, Tasks, Contacts, Options, Sign Out', async () => {
    const user = userEvent.setup();
    const { container } = renderApp();
    await signIn(user);
    await user.click(screen.getByRole('button', { name: 'Open menu' }));

    expectOrder(focusableLabels(container), [
      'Home',
      'Tasks',
      'Contacts',
      'Options',
      'Sign Out',
    ]);
  });
});
