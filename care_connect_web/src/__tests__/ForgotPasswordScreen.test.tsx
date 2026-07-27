import { describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import { renderWithProviders } from '../test-support/renderWithProviders';

describe('ForgotPasswordScreen', () => {
  it('renders the h1 and the reset form', () => {
    renderWithProviders(<ForgotPasswordScreen />);

    expect(
      screen.getByRole('heading', { name: 'CareConnect', level: 1 }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Reset Password', level: 2 }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
  });

  it('moves focus to the heading on mount so the route change is announced', () => {
    renderWithProviders(<ForgotPasswordScreen />);

    expect(
      screen.getByRole('heading', { name: 'CareConnect', level: 1 }),
    ).toHaveFocus();
  });

  it('accepts an email address in the field', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ForgotPasswordScreen />);

    const email = screen.getByLabelText(/email address/i);
    await user.type(email, 'carer@example.com');

    expect(email).toHaveValue('carer@example.com');
    expect(email).toHaveAttribute('aria-required', 'true');
  });

  it('replaces the form with a polite confirmation once submitted', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ForgotPasswordScreen />);

    await user.type(screen.getByLabelText(/email address/i), 'carer@example.com');
    await user.click(screen.getByRole('button', { name: 'Send Reset Link' }));

    const status = screen.getByRole('status');
    expect(status).toHaveTextContent('Reset link sent! Check your email.');
    expect(status).toHaveAttribute('aria-live', 'polite');
    expect(
      screen.queryByRole('button', { name: 'Send Reset Link' }),
    ).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/email address/i)).not.toBeInTheDocument();
  });

  it('returns to login from the Back to Login button', async () => {
    const user = userEvent.setup();
    const onBack = vi.fn();
    renderWithProviders(<ForgotPasswordScreen onBack={onBack} />);

    await user.click(screen.getByRole('button', { name: 'Back to Login' }));

    expect(onBack).toHaveBeenCalledOnce();
  });

  it('keeps the Back to Login button available after submitting', async () => {
    const user = userEvent.setup();
    const onBack = vi.fn();
    renderWithProviders(<ForgotPasswordScreen onBack={onBack} />);

    await user.click(screen.getByRole('button', { name: 'Send Reset Link' }));
    await user.click(screen.getByRole('button', { name: 'Back to Login' }));

    expect(onBack).toHaveBeenCalledOnce();
  });
});
