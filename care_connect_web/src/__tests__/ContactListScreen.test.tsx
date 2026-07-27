import { describe, expect, it, vi } from 'vitest';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ContactListScreen from '../screens/ContactListScreen';
import { makeContact } from '../state/AppState';
import { renderWithProviders } from '../test-support/renderWithProviders';

const contacts = [
  makeContact({
    id: '2',
    name: 'Mike Chen',
    role: 'Physical Therapist',
    phone: '(555) 234-5678',
    email: 'mike.chen@careconnect.com',
  }),
  makeContact({
    id: '1',
    name: 'Dr. Sarah Johnson',
    role: 'Primary Care Physician',
    phone: '(555) 123-4567',
    email: 'sarah.johnson@careconnect.com',
  }),
];

describe('ContactListScreen', () => {
  it('renders the h1', () => {
    renderWithProviders(<ContactListScreen />, { seed: { contacts } });

    expect(
      screen.getByRole('heading', { name: 'Contacts', level: 1 }),
    ).toBeInTheDocument();
  });

  it('renders every contact with role, phone and email', () => {
    renderWithProviders(<ContactListScreen />, { seed: { contacts } });

    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(
      screen.getByRole('heading', { name: 'Mike Chen', level: 2 }),
    ).toBeInTheDocument();
    expect(screen.getByText('Physical Therapist')).toBeInTheDocument();
    expect(screen.getByText('(555) 234-5678')).toBeInTheDocument();
    expect(screen.getByText('mike.chen@careconnect.com')).toBeInTheDocument();
  });

  it('labels the phone and email rows for screen readers', () => {
    renderWithProviders(<ContactListScreen />, { seed: { contacts } });

    expect(screen.getAllByText('Phone:')).toHaveLength(2);
    expect(screen.getAllByText('Email:')).toHaveLength(2);
  });

  it('renders the Add Contact button and reports activation', async () => {
    const user = userEvent.setup();
    const onAddContact = vi.fn();
    renderWithProviders(<ContactListScreen onAddContact={onAddContact} />, {
      seed: { contacts },
    });

    const button = screen.getByRole('button', { name: 'Add Contact' });
    expect(button).toBeInTheDocument();

    await user.click(button);
    expect(onAddContact).toHaveBeenCalledOnce();
  });

  it('sorts A to Z by default and describes that state on the sort button', () => {
    renderWithProviders(<ContactListScreen />, { seed: { contacts } });

    const sort = screen.getByRole('button', {
      name: /sort contacts, currently a to z/i,
    });
    expect(sort).toHaveAttribute('aria-pressed', 'true');

    const items = screen.getAllByRole('listitem');
    expect(within(items[0]).getByRole('heading')).toHaveTextContent(
      'Dr. Sarah Johnson',
    );
  });

  it('reverses the order and the label when the sort button is toggled', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ContactListScreen />, { seed: { contacts } });

    await user.click(
      screen.getByRole('button', { name: /sort contacts, currently a to z/i }),
    );

    expect(
      screen.getByRole('button', { name: /sort contacts, currently z to a/i }),
    ).toHaveAttribute('aria-pressed', 'false');

    const items = screen.getAllByRole('listitem');
    expect(within(items[0]).getByRole('heading')).toHaveTextContent('Mike Chen');
  });

  it('opens the menu from the MENU button', async () => {
    const user = userEvent.setup();
    const onOpenMenu = vi.fn();
    renderWithProviders(<ContactListScreen onOpenMenu={onOpenMenu} />, {
      seed: { contacts },
    });

    await user.click(screen.getByRole('button', { name: 'Open menu' }));

    expect(onOpenMenu).toHaveBeenCalledOnce();
  });

  it('shows an empty state when there are no contacts', () => {
    renderWithProviders(<ContactListScreen />, { seed: { contacts: [] } });

    expect(screen.getByText('No contacts found.')).toBeInTheDocument();
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
  });
});
