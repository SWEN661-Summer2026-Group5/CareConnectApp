import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react-native';
import AddContactScreen from '../../src/screens/AddContactScreen';
import ContactListScreen from '../../src/screens/ContactListScreen';
import {AppStateProvider} from '../../src/state/AppState';
import {renderWithState} from '../../src/test-support/renderWithState';

describe('AddContactScreen (RNTL component test)', () => {
  it('renders all input fields', async () => {
    await renderWithState(<AddContactScreen />, {seed: {contacts: []}});

    expect(screen.getByTestId('add-contact-name')).toBeTruthy();
    expect(screen.getByTestId('add-contact-role')).toBeTruthy();
    expect(screen.getByTestId('add-contact-phone')).toBeTruthy();
    expect(screen.getByTestId('add-contact-email')).toBeTruthy();
  });

  it('does not confirm when the name is empty', async () => {
    const onConfirm = jest.fn();
    await renderWithState(<AddContactScreen onConfirm={onConfirm} />, {
      seed: {contacts: []},
    });

    await fireEvent.press(screen.getByTestId('add-contact-confirm'));

    expect(onConfirm).not.toHaveBeenCalled();
  });

  it('adds the contact to shared state and fires onConfirm', async () => {
    const onConfirm = jest.fn();

    await render(
      <AppStateProvider seed={{contacts: []}}>
        <AddContactScreen onConfirm={onConfirm} />
        <ContactListScreen />
      </AppStateProvider>,
    );

    await fireEvent.changeText(
      screen.getByTestId('add-contact-name'),
      'Emily Rodriguez',
    );
    await fireEvent.changeText(
      screen.getByTestId('add-contact-role'),
      'Home Care Nurse',
    );
    await fireEvent.press(screen.getByTestId('add-contact-confirm'));

    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Emily Rodriguez')).toBeTruthy();
    expect(screen.getByText('Home Care Nurse')).toBeTruthy();
  });

  it('fires discard and menu callbacks', async () => {
    const onDiscard = jest.fn();
    const onOpenMenu = jest.fn();
    await renderWithState(
      <AddContactScreen onDiscard={onDiscard} onOpenMenu={onOpenMenu} />,
      {seed: {contacts: []}},
    );

    await fireEvent.press(screen.getByTestId('add-contact-discard'));
    await fireEvent.press(screen.getByTestId('add-contact-menu'));

    expect(onDiscard).toHaveBeenCalledTimes(1);
    expect(onOpenMenu).toHaveBeenCalledTimes(1);
  });
});
