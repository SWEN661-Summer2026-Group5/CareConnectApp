import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Dialog } from '../components/Dialog';

describe('Dialog', () => {
  it('is a modal dialog with an accessible name and focuses the confirm action', () => {
    render(
      <Dialog
        title="Sign out?"
        message="Are you sure?"
        onConfirm={() => {}}
        onCancel={() => {}}
      />,
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAccessibleName('Sign out?');
    expect(screen.getByRole('button', { name: 'Confirm' })).toHaveFocus();
  });

  it('Escape cancels the dialog', async () => {
    const onCancel = vi.fn();
    const user = userEvent.setup();
    render(
      <Dialog
        title="Sign out?"
        message="Are you sure?"
        onConfirm={() => {}}
        onCancel={onCancel}
      />,
    );
    await user.keyboard('{Escape}');
    expect(onCancel).toHaveBeenCalledOnce();
  });

  it('traps Tab focus within the dialog', async () => {
    const user = userEvent.setup();
    render(
      <Dialog
        title="Sign out?"
        message="Are you sure?"
        cancelLabel="Cancel"
        confirmLabel="Confirm"
        onConfirm={() => {}}
        onCancel={() => {}}
      />,
    );
    const cancel = screen.getByRole('button', { name: 'Cancel' });
    const confirm = screen.getByRole('button', { name: 'Confirm' });

    expect(confirm).toHaveFocus();
    await user.tab(); // wraps back to first focusable
    expect(cancel).toHaveFocus();
  });
});
