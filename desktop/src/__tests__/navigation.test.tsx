import { describe, it, expect } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderApp } from '../test-support/renderApp';

async function signIn(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/^Email Address/), 'a@b.com');
  await user.type(screen.getByLabelText(/^Password/), 'secret');
  await user.click(screen.getByRole('button', { name: 'Sign In' }));
}

describe('navigation & focus management', () => {
  it('moves focus to the page heading after navigating via the menu', async () => {
    const user = userEvent.setup();
    renderApp();
    await signIn(user);

    await user.click(screen.getByRole('button', { name: 'Open menu' }));
    await user.click(screen.getByRole('button', { name: 'Tasks' }));

    const heading = await screen.findByRole('heading', {
      level: 1,
      name: 'Tasks',
    });
    await waitFor(() => expect(heading).toHaveFocus());
  });

  it('requires confirmation before signing out (destructive action)', async () => {
    const user = userEvent.setup();
    renderApp();
    await signIn(user);

    await user.click(screen.getByRole('button', { name: 'Open menu' }));
    await user.click(screen.getByRole('button', { name: 'Sign Out' }));

    // Confirmation dialog appears; cancelling keeps the user signed in.
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAccessibleName(/sign out/i);
    await user.click(screen.getByRole('button', { name: 'Stay Signed In' }));

    expect(screen.getByRole('menubar')).toBeInTheDocument();
  });

  it('confirming sign out returns to the login screen', async () => {
    const user = userEvent.setup();
    renderApp();
    await signIn(user);

    await user.click(screen.getByRole('button', { name: 'Open menu' }));
    await user.click(screen.getByRole('button', { name: 'Sign Out' }));
    const dialog = screen.getByRole('dialog');
    await user.click(within(dialog).getByRole('button', { name: 'Sign Out' }));

    await waitFor(() =>
      expect(screen.queryByRole('menubar')).not.toBeInTheDocument(),
    );
    expect(screen.getByRole('heading', { name: 'CareConnect' })).toBeInTheDocument();
  });
});
