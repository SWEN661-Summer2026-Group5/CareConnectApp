import { describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HomeScreen from '../screens/HomeScreen';
import { makeTask } from '../state/AppState';
import { renderWithProviders } from '../test-support/renderWithProviders';

// Fixed, future-dated tasks keep the rendered badge and ordering deterministic
// regardless of when the suite runs.
const soon = new Date(Date.now() + 60 * 60 * 1000);
const later = new Date(Date.now() + 5 * 60 * 60 * 1000);

const seedTasks = [
  makeTask({ id: '1', title: 'Take morning medication', dueDate: soon }),
  makeTask({ id: '2', title: 'Physical therapy appointment', dueDate: later }),
];

describe('HomeScreen', () => {
  it('renders the page heading', () => {
    renderWithProviders(<HomeScreen />, { seed: { tasks: seedTasks } });

    expect(
      screen.getByRole('heading', { name: 'Home', level: 1 }),
    ).toBeInTheDocument();
  });

  it('renders the Next Task card for the soonest task', () => {
    renderWithProviders(<HomeScreen />, { seed: { tasks: seedTasks } });

    expect(
      screen.getByRole('heading', { name: 'Next Task', level: 2 }),
    ).toBeInTheDocument();
    expect(screen.getByText('Take morning medication')).toBeInTheDocument();
  });

  it('renders a Next Up card for the following task', () => {
    renderWithProviders(<HomeScreen />, { seed: { tasks: seedTasks } });

    expect(
      screen.getByRole('heading', { name: 'Next Up', level: 2 }),
    ).toBeInTheDocument();
    expect(screen.getByText('Physical therapy appointment')).toBeInTheDocument();
  });

  it('renders the View All Tasks button and reports activation', async () => {
    const user = userEvent.setup();
    const onViewAllTasks = vi.fn();
    renderWithProviders(<HomeScreen onViewAllTasks={onViewAllTasks} />, {
      seed: { tasks: seedTasks },
    });

    const button = screen.getByRole('button', { name: 'View All Tasks' });
    expect(button).toBeInTheDocument();

    await user.click(button);
    expect(onViewAllTasks).toHaveBeenCalledTimes(1);
  });

  it('passes the next task id to onViewTask', async () => {
    const user = userEvent.setup();
    const onViewTask = vi.fn();
    renderWithProviders(<HomeScreen onViewTask={onViewTask} />, {
      seed: { tasks: seedTasks },
    });

    await user.click(
      screen.getByRole('button', { name: /view task: take morning medication/i }),
    );

    expect(onViewTask).toHaveBeenCalledWith('1');
  });

  it('opens the menu from the MENU button', async () => {
    const user = userEvent.setup();
    const onOpenMenu = vi.fn();
    renderWithProviders(<HomeScreen onOpenMenu={onOpenMenu} />, {
      seed: { tasks: seedTasks },
    });

    await user.click(screen.getByRole('button', { name: 'Open menu' }));

    expect(onOpenMenu).toHaveBeenCalledTimes(1);
  });

  it('shows an empty state when there are no active tasks', () => {
    renderWithProviders(<HomeScreen />, { seed: { tasks: [] } });

    expect(screen.getByText('No upcoming tasks.')).toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: 'Next Task' }),
    ).not.toBeInTheDocument();
  });
});
