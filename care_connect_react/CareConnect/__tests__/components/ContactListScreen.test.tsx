import React from 'react';
import {fireEvent, screen} from '@testing-library/react-native';
import ContactListScreen from '../../src/screens/ContactListScreen';
import {makeContact} from '../../src/state/AppState';
import {renderWithState} from '../../src/test-support/renderWithState';

const contacts = [
  makeContact({
    id: '1',
    name: 'Dr. Sarah Johnson',
    role: 'Primary Care Physician',
    phone: '(555) 123-4567',
    email: 'sarah.johnson@careconnect.com',
  }),
  makeContact({id: '2', name: 'Mike Chen', role: 'Physical Therapist'}),
];

describe('ContactListScreen (RNTL component test)', () => {
  it('renders contacts with their details', async () => {
    await renderWithState(<ContactListScreen />, {seed: {contacts}});

    expect(screen.getByText('Dr. Sarah Johnson')).toBeTruthy();
    expect(screen.getByText('Primary Care Physician')).toBeTruthy();
    expect(screen.getByText('(555) 123-4567')).toBeTruthy();
    expect(screen.getByText('Mike Chen')).toBeTruthy();
  });

  it('renders contacts sorted alphabetically by default', async () => {
    await renderWithState(<ContactListScreen />, {seed: {contacts}});

    const names = screen
      .getAllByText(/Dr\. Sarah Johnson|Mike Chen/)
      .map(node => node.props.children);

    expect(names).toEqual(['Dr. Sarah Johnson', 'Mike Chen']);
  });

  it('toggles the contact sort direction', async () => {
    await renderWithState(<ContactListScreen />, {seed: {contacts}});

    const sortButton = screen.getByTestId('contacts-sort');
    expect(sortButton.props.accessibilityState.selected).toBe(true);

    await fireEvent.press(sortButton);

    expect(
      screen.getByTestId('contacts-sort').props.accessibilityState.selected,
    ).toBe(false);
  });

  it('fires add-contact and menu callbacks', async () => {
    const onAddContact = jest.fn();
    const onOpenMenu = jest.fn();
    await renderWithState(
      <ContactListScreen
        onAddContact={onAddContact}
        onOpenMenu={onOpenMenu}
      />,
      {seed: {contacts}},
    );

    await fireEvent.press(screen.getByTestId('contacts-add'));
    await fireEvent.press(screen.getByTestId('contacts-menu'));

    expect(onAddContact).toHaveBeenCalledTimes(1);
    expect(onOpenMenu).toHaveBeenCalledTimes(1);
  });
});
