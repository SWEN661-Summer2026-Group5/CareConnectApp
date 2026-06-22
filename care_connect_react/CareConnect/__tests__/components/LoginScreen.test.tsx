import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react-native';
import LoginScreen from '../../src/screens/LoginScreen';

// NOTE: In React Native Testing Library v14, render() and the fireEvent
// helpers are async and must be awaited.
describe('LoginScreen (RNTL component test)', () => {
  it('renders the sign-in form', async () => {
    await render(<LoginScreen />);

    expect(screen.getByText('CareConnect')).toBeTruthy();
    // "Sign In" appears twice: the card heading and the submit button.
    expect(screen.getAllByText('Sign In')).toHaveLength(2);
    expect(screen.getByPlaceholderText('Enter your email')).toBeTruthy();
    expect(screen.getByPlaceholderText('Enter your password')).toBeTruthy();
    expect(screen.getByTestId('login-submit')).toBeTruthy();
  });

  it('does not sign in when fields are empty', async () => {
    const onSignIn = jest.fn();
    await render(<LoginScreen onSignIn={onSignIn} />);

    await fireEvent.press(screen.getByTestId('login-submit'));

    expect(onSignIn).not.toHaveBeenCalled();
  });

  it('signs in once both email and password are provided', async () => {
    const onSignIn = jest.fn();
    await render(<LoginScreen onSignIn={onSignIn} />);

    await fireEvent.changeText(
      screen.getByTestId('login-email'),
      'jane@careconnect.com',
    );
    await fireEvent.changeText(
      screen.getByTestId('login-password'),
      'secret123',
    );
    await fireEvent.press(screen.getByTestId('login-submit'));

    expect(onSignIn).toHaveBeenCalledTimes(1);
  });

  it('toggles password visibility between SHOW and HIDE', async () => {
    await render(<LoginScreen />);

    expect(screen.getByText('SHOW')).toBeTruthy();
    expect(screen.getByTestId('login-password').props.secureTextEntry).toBe(
      true,
    );

    await fireEvent.press(screen.getByTestId('login-toggle-password'));

    expect(screen.getByText('HIDE')).toBeTruthy();
    expect(screen.getByTestId('login-password').props.secureTextEntry).toBe(
      false,
    );
  });

  it('navigates to the forgot-password flow', async () => {
    const onForgotPassword = jest.fn();
    await render(<LoginScreen onForgotPassword={onForgotPassword} />);

    await fireEvent.press(screen.getByTestId('login-forgot'));

    expect(onForgotPassword).toHaveBeenCalledTimes(1);
  });
});
