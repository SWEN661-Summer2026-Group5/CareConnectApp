import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react-native';
import MenuScreen from '../../src/screens/MenuScreen';

describe('MenuScreen (RNTL component test)', () => {
  it('renders all navigation entries', async () => {
    await render(<MenuScreen />);

    expect(screen.getByText('Menu')).toBeTruthy();
    expect(screen.getByText('Home')).toBeTruthy();
    expect(screen.getByText('Tasks')).toBeTruthy();
    expect(screen.getByText('Contacts')).toBeTruthy();
    expect(screen.getByText('Options')).toBeTruthy();
    expect(screen.getByText('Sign Out')).toBeTruthy();
  });

  it('routes each menu button to its callback', async () => {
    const handlers = {
      onHome: jest.fn(),
      onTasks: jest.fn(),
      onContacts: jest.fn(),
      onOptions: jest.fn(),
      onSignOut: jest.fn(),
    };
    await render(<MenuScreen {...handlers} />);

    await fireEvent.press(screen.getByTestId('menu-home'));
    await fireEvent.press(screen.getByTestId('menu-tasks'));
    await fireEvent.press(screen.getByTestId('menu-contacts'));
    await fireEvent.press(screen.getByTestId('menu-options'));
    await fireEvent.press(screen.getByTestId('menu-sign-out'));

    expect(handlers.onHome).toHaveBeenCalledTimes(1);
    expect(handlers.onTasks).toHaveBeenCalledTimes(1);
    expect(handlers.onContacts).toHaveBeenCalledTimes(1);
    expect(handlers.onOptions).toHaveBeenCalledTimes(1);
    expect(handlers.onSignOut).toHaveBeenCalledTimes(1);
  });
});
