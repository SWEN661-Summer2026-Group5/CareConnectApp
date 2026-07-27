import { afterEach, describe, expect, it, vi } from 'vitest';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MenuScreen from '../screens/MenuScreen';
import { renderWithProviders } from '../test-support/renderWithProviders';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('MenuScreen', () => {
  it('renders the h1 and the labelled navigation region', () => {
    renderWithProviders(<MenuScreen />);

    expect(
      screen.getByRole('heading', { name: 'Menu', level: 1 }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('navigation', { name: 'Primary navigation' }),
    ).toBeInTheDocument();
  });

  it('lists exactly the four destinations', () => {
    renderWithProviders(<MenuScreen />);

    const nav = screen.getByRole('navigation', { name: 'Primary navigation' });
    const items = within(nav).getAllByRole('button');
    expect(items.map((b) => b.textContent)).toEqual([
      'Home',
      'Tasks',
      'Contacts',
      'Options',
    ]);
  });

  it('routes to Home and Tasks through their callbacks', async () => {
    const user = userEvent.setup();
    const onHome = vi.fn();
    const onTasks = vi.fn();
    renderWithProviders(<MenuScreen onHome={onHome} onTasks={onTasks} />);

    await user.click(screen.getByRole('button', { name: 'Home' }));
    expect(onHome).toHaveBeenCalledOnce();

    await user.click(screen.getByRole('button', { name: 'Tasks' }));
    expect(onTasks).toHaveBeenCalledOnce();
  });

  it('routes to Contacts and Options through their callbacks', async () => {
    const user = userEvent.setup();
    const onContacts = vi.fn();
    const onOptions = vi.fn();
    renderWithProviders(
      <MenuScreen onContacts={onContacts} onOptions={onOptions} />,
    );

    await user.click(screen.getByRole('button', { name: 'Contacts' }));
    expect(onContacts).toHaveBeenCalledOnce();

    await user.click(screen.getByRole('button', { name: 'Options' }));
    expect(onOptions).toHaveBeenCalledOnce();
  });

  it('signs out only after the confirmation is accepted', async () => {
    const user = userEvent.setup();
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    const onSignOut = vi.fn();
    renderWithProviders(<MenuScreen onSignOut={onSignOut} />);

    await user.click(screen.getByRole('button', { name: 'Sign Out' }));

    expect(confirmSpy).toHaveBeenCalledOnce();
    expect(confirmSpy.mock.calls[0][0]).toMatch(/sign out of careconnect/i);
    expect(onSignOut).toHaveBeenCalledOnce();
  });

  it('stays signed in when the confirmation is dismissed', async () => {
    const user = userEvent.setup();
    vi.spyOn(window, 'confirm').mockReturnValue(false);
    const onSignOut = vi.fn();
    renderWithProviders(<MenuScreen onSignOut={onSignOut} />);

    await user.click(screen.getByRole('button', { name: 'Sign Out' }));

    expect(onSignOut).not.toHaveBeenCalled();
  });
});
