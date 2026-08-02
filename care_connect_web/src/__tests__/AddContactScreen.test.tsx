import { afterEach, describe, expect, it, vi } from 'vitest';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddContactScreen from '../screens/AddContactScreen';
import { useAppState } from '../state/AppState';
import { renderWithProviders } from '../test-support/renderWithProviders';

/** Exposes the store's contacts so tests can assert a real state change. */
function ContactProbe() {
  const { contacts } = useAppState();
  return (
    <ul aria-label="stored contacts">
      {contacts.map((c) => (
        <li key={c.id}>{`${c.name} — ${c.role} — ${c.phone} — ${c.email}`}</li>
      ))}
    </ul>
  );
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('AddContactScreen', () => {
  it('renders the h1 and all four fields', () => {
    renderWithProviders(<AddContactScreen />, { seed: { contacts: [] } });

    expect(
      screen.getByRole('heading', { name: 'Add Contact', level: 1 }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/contact name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/role/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
  });

  it('uses input types that bring up the right mobile keyboards', () => {
    renderWithProviders(<AddContactScreen />, { seed: { contacts: [] } });

    expect(screen.getByLabelText(/phone number/i)).toHaveAttribute('type', 'tel');
    expect(screen.getByLabelText(/email address/i)).toHaveAttribute('type', 'email');
    expect(screen.getByLabelText(/contact name/i)).toHaveAttribute(
      'aria-required',
      'true',
    );
  });

  it('stores the trimmed contact and confirms on submit', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    renderWithProviders(
      <>
        <AddContactScreen onConfirm={onConfirm} />
        <ContactProbe />
      </>,
      { seed: { contacts: [] } },
    );

    await user.type(screen.getByLabelText(/contact name/i), '  Emily Rodriguez  ');
    await user.type(screen.getByLabelText(/role/i), 'Home Care Nurse');
    await user.type(screen.getByLabelText(/phone number/i), '(555) 345-6789');
    await user.type(
      screen.getByLabelText(/email address/i),
      'emily.rodriguez@careconnect.com',
    );
    await user.click(screen.getByRole('button', { name: 'Confirm' }));

    expect(onConfirm).toHaveBeenCalledOnce();
    expect(screen.getByRole('list', { name: 'stored contacts' })).toHaveTextContent(
      'Emily Rodriguez — Home Care Nurse — (555) 345-6789 — emily.rodriguez@careconnect.com',
    );
  });

  it('rejects a blank name and stores nothing', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    renderWithProviders(
      <>
        <AddContactScreen onConfirm={onConfirm} />
        <ContactProbe />
      </>,
      { seed: { contacts: [] } },
    );

    await user.type(screen.getByLabelText(/role/i), 'Nurse');
    await user.click(screen.getByRole('button', { name: 'Confirm' }));

    expect(onConfirm).not.toHaveBeenCalled();
    expect(screen.getByText('A contact name is required.')).toBeInTheDocument();
    expect(
      screen.getByRole('list', { name: 'stored contacts' }).children,
    ).toHaveLength(0);
  });

  it('discards straight away when the form is untouched', async () => {
    const user = userEvent.setup();
    const onDiscard = vi.fn();
    renderWithProviders(<AddContactScreen onDiscard={onDiscard} />, {
      seed: { contacts: [] },
    });

    await user.click(screen.getByRole('button', { name: 'Discard Changes' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(onDiscard).toHaveBeenCalledOnce();
  });

  it('asks before discarding a partly filled form and honours a refusal', async () => {
    const user = userEvent.setup();
    const onDiscard = vi.fn();
    renderWithProviders(<AddContactScreen onDiscard={onDiscard} />, {
      seed: { contacts: [] },
    });

    await user.type(screen.getByLabelText(/phone number/i), '555');
    await user.click(screen.getByRole('button', { name: 'Discard Changes' }));

    const dialog = screen.getByRole('dialog', { name: /discard this contact/i });
    await user.click(
      within(dialog).getByRole('button', { name: 'Keep Editing' }),
    );

    expect(onDiscard).not.toHaveBeenCalled();
  });

  it('opens the menu from the MENU button', async () => {
    const user = userEvent.setup();
    const onOpenMenu = vi.fn();
    renderWithProviders(<AddContactScreen onOpenMenu={onOpenMenu} />, {
      seed: { contacts: [] },
    });

    await user.click(screen.getByRole('button', { name: 'Open menu' }));

    expect(onOpenMenu).toHaveBeenCalledOnce();
  });
});
