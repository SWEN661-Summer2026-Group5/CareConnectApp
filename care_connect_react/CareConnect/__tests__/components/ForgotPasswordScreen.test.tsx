import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react-native';
import ForgotPasswordScreen from '../../src/screens/ForgotPasswordScreen';

describe('ForgotPasswordScreen (RNTL component test)', () => {
  it('renders the reset form initially', async () => {
    await render(<ForgotPasswordScreen />);

    expect(screen.getByText('Reset Password')).toBeTruthy();
    expect(screen.getByTestId('reset-email')).toBeTruthy();
    expect(screen.getByTestId('reset-submit')).toBeTruthy();
    expect(screen.queryByTestId('reset-confirmation')).toBeNull();
  });

  it('shows a confirmation and hides the form after sending', async () => {
    await render(<ForgotPasswordScreen />);

    await fireEvent.changeText(
      screen.getByTestId('reset-email'),
      'jane@careconnect.com',
    );
    await fireEvent.press(screen.getByTestId('reset-submit'));

    expect(screen.getByTestId('reset-confirmation')).toBeTruthy();
    expect(
      screen.getByText('Reset link sent! Check your email.'),
    ).toBeTruthy();
    expect(screen.queryByTestId('reset-submit')).toBeNull();
  });

  it('navigates back to login', async () => {
    const onBack = jest.fn();
    await render(<ForgotPasswordScreen onBack={onBack} />);

    await fireEvent.press(screen.getByTestId('reset-back'));

    expect(onBack).toHaveBeenCalledTimes(1);
  });
});
