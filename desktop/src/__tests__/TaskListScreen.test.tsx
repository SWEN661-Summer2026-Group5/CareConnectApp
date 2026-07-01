import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskListScreen from '../screens/TaskListScreen';
import { renderWithProviders } from '../test-support/renderApp';

describe('TaskListScreen', () => {
  it('lists active tasks and hides completed tasks until expanded', async () => {
    const user = userEvent.setup();
    renderWithProviders(<TaskListScreen />);

    expect(
      screen.getByRole('button', { name: /take morning medication/i }),
    ).toBeInTheDocument();

    const toggle = screen.getByRole('button', { name: /1 Completed/i });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText('Morning walk')).not.toBeInTheDocument();

    await user.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Morning walk')).toBeInTheDocument();
  });

  it('sort toggle announces state via aria-pressed', async () => {
    const user = userEvent.setup();
    renderWithProviders(<TaskListScreen />);

    const sort = screen.getByRole('button', { name: /sort tasks/i });
    expect(sort).toHaveAttribute('aria-pressed', 'true');

    await user.click(sort);
    expect(sort).toHaveAttribute('aria-pressed', 'false');
  });

  it('renders the sort control as a native button element', () => {
    const { container } = renderWithProviders(<TaskListScreen />);
    expect(container.querySelector('.sort-button')?.tagName).toBe('BUTTON');
  });

  it('shows a status badge with a visible text label, not colour alone (WCAG 1.4.1)', () => {
    renderWithProviders(<TaskListScreen />);
    // Seed includes a future task ("Doctor checkup" tomorrow) → Follow-up badge.
    expect(
      screen.getAllByText(/High Priority|Follow-up/).length,
    ).toBeGreaterThan(0);
  });
});
