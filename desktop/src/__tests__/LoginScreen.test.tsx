import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderApp } from '../test-support/renderApp';

describe('LoginScreen', () => {
  it('shows an accessible error when fields are empty and does not navigate', async () => {
    const user = userEvent.setup();
    renderApp();

    await user.click(screen.getByRole('button', { name: 'Sign In' }));

    expect(screen.getByRole('alert')).toHaveTextContent(/enter both/i);
    // Still on the login screen (no menu bar rendered pre-auth).
    expect(screen.queryByRole('menubar')).not.toBeInTheDocument();
  });

  it('toggles password visibility with an aria-pressed button', async () => {
    const user = userEvent.setup();
    renderApp();

    const password = screen.getByLabelText(/^Password/);
    expect(password).toHaveAttribute('type', 'password');

    const toggle = screen.getByRole('button', { name: /show password/i });
    expect(toggle).toHaveAttribute('aria-pressed', 'false');

    await user.click(toggle);
    expect(password).toHaveAttribute('type', 'text');
    expect(
      screen.getByRole('button', { name: /hide password/i }),
    ).toHaveAttribute('aria-pressed', 'true');
  });

  it('signs in and reveals the authenticated chrome once both fields are set', async () => {
    const user = userEvent.setup();
    renderApp();

    await user.type(screen.getByLabelText(/^Email Address/), 'a@b.com');
    await user.type(screen.getByLabelText(/^Password/), 'secret');
    await user.click(screen.getByRole('button', { name: 'Sign In' }));

    expect(screen.getByRole('menubar')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 1, name: 'Home' }),
    ).toBeInTheDocument();
  });
});
