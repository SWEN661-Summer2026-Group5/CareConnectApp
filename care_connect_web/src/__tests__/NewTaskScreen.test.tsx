import { afterEach, describe, expect, it, vi } from 'vitest';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NewTaskScreen from '../screens/NewTaskScreen';
import { useAppState } from '../state/AppState';
import { renderWithProviders } from '../test-support/renderWithProviders';

/** Renders the titles currently held in the store, so tests can assert that a
 *  submitted task really landed in state rather than only firing a callback. */
function TaskProbe() {
  const { tasks } = useAppState();
  return <ul aria-label="stored tasks">{tasks.map((t) => <li key={t.id}>{t.title}</li>)}</ul>;
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('NewTaskScreen', () => {
  it('renders the h1 and both form fields', () => {
    renderWithProviders(<NewTaskScreen />, { seed: { tasks: [] } });

    expect(
      screen.getByRole('heading', { name: 'Add New Task', level: 1 }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/task title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/details/i)).toBeInTheDocument();
  });

  it('marks the title as required and the details as optional', () => {
    renderWithProviders(<NewTaskScreen />, { seed: { tasks: [] } });

    expect(screen.getByLabelText(/task title/i)).toHaveAttribute(
      'aria-required',
      'true',
    );
    expect(screen.getByLabelText(/details/i)).not.toHaveAttribute('aria-required');
  });

  it('adds the task to state and confirms when the form is submitted', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    renderWithProviders(
      <>
        <NewTaskScreen onConfirm={onConfirm} />
        <TaskProbe />
      </>,
      { seed: { tasks: [] } },
    );

    await user.type(screen.getByLabelText(/task title/i), 'Collect prescription');
    await user.type(screen.getByLabelText(/details/i), 'Pharmacy closes at 6pm');
    await user.click(screen.getByRole('button', { name: 'Confirm' }));

    expect(onConfirm).toHaveBeenCalledOnce();
    expect(
      screen.getByRole('list', { name: 'stored tasks' }),
    ).toHaveTextContent('Collect prescription');
  });

  it('rejects an empty title and stores nothing', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    renderWithProviders(
      <>
        <NewTaskScreen onConfirm={onConfirm} />
        <TaskProbe />
      </>,
      { seed: { tasks: [] } },
    );

    await user.click(screen.getByRole('button', { name: 'Confirm' }));

    expect(onConfirm).not.toHaveBeenCalled();
    expect(screen.getByText('A task title is required.')).toBeInTheDocument();
    expect(screen.getByLabelText(/task title/i)).toHaveAttribute(
      'aria-invalid',
      'true',
    );
    expect(
      screen.getByRole('list', { name: 'stored tasks' }).children,
    ).toHaveLength(0);
  });

  it('discards without confirming when nothing has been typed', async () => {
    const user = userEvent.setup();
    const onDiscard = vi.fn();
    renderWithProviders(<NewTaskScreen onDiscard={onDiscard} />, {
      seed: { tasks: [] },
    });

    await user.click(screen.getByRole('button', { name: 'Discard Changes' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(onDiscard).toHaveBeenCalledOnce();
  });

  it('asks before discarding entered details, and honours a refusal', async () => {
    const user = userEvent.setup();
    const onDiscard = vi.fn();
    renderWithProviders(<NewTaskScreen onDiscard={onDiscard} />, {
      seed: { tasks: [] },
    });

    await user.type(screen.getByLabelText(/task title/i), 'Half-written task');
    await user.click(screen.getByRole('button', { name: 'Discard Changes' }));

    const dialog = screen.getByRole('dialog', { name: /discard this task/i });
    await user.click(
      within(dialog).getByRole('button', { name: 'Keep Editing' }),
    );

    expect(onDiscard).not.toHaveBeenCalled();
  });

  it('opens the menu from the MENU button', async () => {
    const user = userEvent.setup();
    const onOpenMenu = vi.fn();
    renderWithProviders(<NewTaskScreen onOpenMenu={onOpenMenu} />, {
      seed: { tasks: [] },
    });

    await user.click(screen.getByRole('button', { name: 'Open menu' }));

    expect(onOpenMenu).toHaveBeenCalledOnce();
  });
});
