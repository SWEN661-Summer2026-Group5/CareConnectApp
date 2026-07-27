import { afterEach, describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskDetailScreen from '../screens/TaskDetailScreen';
import { makeTask } from '../state/AppState';
import { renderWithProviders } from '../test-support/renderWithProviders';

const soon = new Date(Date.now() + 60 * 60 * 1000);

const task = makeTask({
  id: '1',
  title: 'Take morning medication',
  details: 'Take 2 blue pills and 1 white pill with water.',
  dueDate: soon,
  caregiverName: 'Dr. Sarah Johnson',
  caregiverPhone: '(555) 123-4567',
  caregiverEmail: 'sarah.johnson@careconnect.com',
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('TaskDetailScreen', () => {
  it('renders the h1 and the task it was given', () => {
    renderWithProviders(<TaskDetailScreen taskId="1" />, { seed: { tasks: [task] } });

    expect(
      screen.getByRole('heading', { name: 'Task Details', level: 1 }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Take morning medication', level: 2 }),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Take 2 blue pills and 1 white pill with water.'),
    ).toBeInTheDocument();
  });

  it('renders the caregiver contact details', () => {
    renderWithProviders(<TaskDetailScreen taskId="1" />, { seed: { tasks: [task] } });

    expect(screen.getByText('Dr. Sarah Johnson')).toBeInTheDocument();
    expect(screen.getByText('(555) 123-4567')).toBeInTheDocument();
    expect(screen.getByText('sarah.johnson@careconnect.com')).toBeInTheDocument();
  });

  it('marks the task resolved after the confirmation is accepted', async () => {
    const user = userEvent.setup();
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    const onResolved = vi.fn();
    renderWithProviders(
      <TaskDetailScreen taskId="1" onResolved={onResolved} />,
      { seed: { tasks: [task] } },
    );

    await user.click(
      screen.getByRole('button', { name: /mark take morning medication as resolved/i }),
    );

    expect(confirmSpy).toHaveBeenCalledOnce();
    expect(onResolved).toHaveBeenCalledOnce();
    // The screen re-reads the task from state: the badge flips and the action
    // disappears, proving the store was actually updated.
    expect(screen.getByText('Completed')).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /as resolved/i }),
    ).not.toBeInTheDocument();
  });

  it('leaves the task untouched when the confirmation is dismissed', async () => {
    const user = userEvent.setup();
    vi.spyOn(window, 'confirm').mockReturnValue(false);
    const onResolved = vi.fn();
    renderWithProviders(
      <TaskDetailScreen taskId="1" onResolved={onResolved} />,
      { seed: { tasks: [task] } },
    );

    await user.click(
      screen.getByRole('button', { name: /mark take morning medication as resolved/i }),
    );

    expect(onResolved).not.toHaveBeenCalled();
    expect(screen.queryByText('Completed')).not.toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /as resolved/i }),
    ).toBeInTheDocument();
  });

  it('navigates back and opens the menu from the footer actions', async () => {
    const user = userEvent.setup();
    const onBack = vi.fn();
    const onOpenMenu = vi.fn();
    renderWithProviders(
      <TaskDetailScreen taskId="1" onBack={onBack} onOpenMenu={onOpenMenu} />,
      { seed: { tasks: [task] } },
    );

    await user.click(screen.getByRole('button', { name: 'Open menu' }));
    expect(onOpenMenu).toHaveBeenCalledOnce();

    await user.click(screen.getByRole('button', { name: 'Back to task list' }));
    expect(onBack).toHaveBeenCalledOnce();
  });

  it('hides the resolve action for an already completed task', () => {
    const done = makeTask({ ...task, completed: true });
    renderWithProviders(<TaskDetailScreen taskId="1" />, { seed: { tasks: [done] } });

    expect(
      screen.queryByRole('button', { name: /as resolved/i }),
    ).not.toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  it('falls back to a not-found state for an unknown id', async () => {
    const user = userEvent.setup();
    const onBack = vi.fn();
    renderWithProviders(<TaskDetailScreen taskId="999" onBack={onBack} />, {
      seed: { tasks: [task] },
    });

    expect(screen.getByText('Task not found.')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Back' }));
    expect(onBack).toHaveBeenCalledOnce();
  });
});
