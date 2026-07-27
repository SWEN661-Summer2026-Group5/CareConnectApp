import { describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginScreen from '../screens/LoginScreen';
import { renderWithProviders } from '../test-support/renderWithProviders';

describe('LoginScreen', () => {
  it('renders the sign-in form with both credential fields', () => {
    renderWithProviders(<LoginScreen />);

    expect(
      screen.getByRole('heading', { name: 'CareConnect', level: 1 }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Sign In', level: 2 }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i, { selector: 'input' })).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i, { selector: 'input' })).toBeInTheDocument();
  });

  it('marks both fields as required for assistive technology', () => {
    renderWithProviders(<LoginScreen />);

    expect(screen.getByLabelText(/email address/i, { selector: 'input' })).toHaveAttribute(
      'aria-required',
      'true',
    );
    expect(screen.getByLabelText(/password/i, { selector: 'input' })).toHaveAttribute(
      'aria-required',
      'true',
    );
  });

  it('renders the sign in button and the forgot password link', () => {
    renderWithProviders(<LoginScreen />);

    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /forgot password/i }),
    ).toBeInTheDocument();
  });

  it('calls onSignIn once valid credentials are entered', async () => {
    const user = userEvent.setup();
    const onSignIn = vi.fn();
    renderWithProviders(<LoginScreen onSignIn={onSignIn} />);

    await user.type(screen.getByLabelText(/email address/i, { selector: 'input' }), 'carer@example.com');
    await user.type(screen.getByLabelText(/password/i, { selector: 'input' }), 'hunter2');
    await user.click(screen.getByRole('button', { name: 'Sign In' }));

    expect(onSignIn).toHaveBeenCalledTimes(1);
  });

  it('blocks submission and shows an alert when fields are empty', async () => {
    const user = userEvent.setup();
    const onSignIn = vi.fn();
    renderWithProviders(<LoginScreen onSignIn={onSignIn} />);

    await user.click(screen.getByRole('button', { name: 'Sign In' }));

    expect(onSignIn).not.toHaveBeenCalled();
    expect(screen.getByRole('alert')).toHaveTextContent(
      /enter both your email address and password/i,
    );
  });

  it('toggles password visibility and announces the state', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginScreen />);

    const toggle = screen.getByRole('button', { name: /show password/i });
    expect(screen.getByLabelText(/password/i, { selector: 'input' })).toHaveAttribute('type', 'password');
    expect(toggle).toHaveAttribute('aria-pressed', 'false');

    await user.click(toggle);

    expect(screen.getByLabelText(/password/i, { selector: 'input' })).toHaveAttribute('type', 'text');
    expect(
      screen.getByRole('button', { name: /hide password/i }),
    ).toHaveAttribute('aria-pressed', 'true');
  });

  it('calls onForgotPassword when the link is activated', async () => {
    const user = userEvent.setup();
    const onForgotPassword = vi.fn();
    renderWithProviders(<LoginScreen onForgotPassword={onForgotPassword} />);

    await user.click(screen.getByRole('button', { name: /forgot password/i }));

    expect(onForgotPassword).toHaveBeenCalledTimes(1);
  });
});
