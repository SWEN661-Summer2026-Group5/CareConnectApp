import { describe, expect, it, vi } from 'vitest';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskListScreen from '../screens/TaskListScreen';
import { makeTask } from '../state/AppState';
import { renderWithProviders } from '../test-support/renderWithProviders';

const soon = new Date(Date.now() + 60 * 60 * 1000);
const later = new Date(Date.now() + 5 * 60 * 60 * 1000);
const past = new Date(Date.now() - 60 * 60 * 1000);

const seedTasks = [
  makeTask({ id: '1', title: 'Take morning medication', dueDate: soon }),
  makeTask({ id: '2', title: 'Physical therapy appointment', dueDate: later }),
  makeTask({ id: '3', title: 'Morning walk', dueDate: past, completed: true }),
];

describe('TaskListScreen', () => {
  it('renders the heading and the active task count', () => {
    renderWithProviders(<TaskListScreen />, { seed: { tasks: seedTasks } });

    expect(
      screen.getByRole('heading', { name: 'Tasks', level: 1 }),
    ).toBeInTheDocument();
    expect(screen.getByText('Active (2)')).toBeInTheDocument();
  });

  it('lists every active task and excludes completed ones', () => {
    renderWithProviders(<TaskListScreen />, { seed: { tasks: seedTasks } });

    const list = screen.getByRole('list');
    expect(within(list).getAllByRole('button')).toHaveLength(2);
    expect(screen.getByText('Take morning medication')).toBeInTheDocument();
    expect(screen.getByText('Physical therapy appointment')).toBeInTheDocument();
    expect(screen.queryByText('Morning walk')).not.toBeInTheDocument();
  });

  it('renders the Add New Task button and reports activation', async () => {
    const user = userEvent.setup();
    const onAddTask = vi.fn();
    renderWithProviders(<TaskListScreen onAddTask={onAddTask} />, {
      seed: { tasks: seedTasks },
    });

    const button = screen.getByRole('button', { name: 'Add New Task' });
    expect(button).toBeInTheDocument();

    await user.click(button);
    expect(onAddTask).toHaveBeenCalledTimes(1);
  });

  it('gives the sort button an accessible label describing its current state', () => {
    renderWithProviders(<TaskListScreen />, { seed: { tasks: seedTasks } });

    const sort = screen.getByRole('button', {
      name: /sort tasks, currently earliest first/i,
    });
    expect(sort).toHaveAttribute('aria-pressed', 'true');
  });

  it('reverses the sort label and order when toggled', async () => {
    const user = userEvent.setup();
    renderWithProviders(<TaskListScreen />, { seed: { tasks: seedTasks } });

    await user.click(
      screen.getByRole('button', { name: /sort tasks, currently earliest first/i }),
    );

    const sort = screen.getByRole('button', {
      name: /sort tasks, currently latest first/i,
    });
    expect(sort).toHaveAttribute('aria-pressed', 'false');

    const rows = within(screen.getByRole('list')).getAllByRole('button');
    expect(rows[0]).toHaveTextContent('Physical therapy appointment');
  });

  it('passes the task id to onOpenTask when a row is activated', async () => {
    const user = userEvent.setup();
    const onOpenTask = vi.fn();
    renderWithProviders(<TaskListScreen onOpenTask={onOpenTask} />, {
      seed: { tasks: seedTasks },
    });

    await user.click(
      screen.getByRole('button', { name: /take morning medication.*opens task details/i }),
    );

    expect(onOpenTask).toHaveBeenCalledWith('1');
  });

  it('expands the completed section on demand', async () => {
    const user = userEvent.setup();
    renderWithProviders(<TaskListScreen />, { seed: { tasks: seedTasks } });

    const toggle = screen.getByRole('button', { name: /1 completed/i });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');

    await user.click(toggle);

    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Morning walk')).toBeInTheDocument();
  });

  it('shows an empty state when no tasks are active', () => {
    renderWithProviders(<TaskListScreen />, { seed: { tasks: [] } });

    expect(screen.getByText('No active tasks.')).toBeInTheDocument();
  });
});
