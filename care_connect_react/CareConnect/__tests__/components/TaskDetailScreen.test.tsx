import React from 'react';
import {fireEvent, screen} from '@testing-library/react-native';
import TaskDetailScreen from '../../src/screens/TaskDetailScreen';
import {makeTask} from '../../src/state/AppState';
import {renderWithState} from '../../src/test-support/renderWithState';

const taskWithCaregiver = makeTask({
  id: '1',
  title: 'Take morning medication',
  details: 'Take 2 blue pills and 1 white pill with water',
  dueDate: new Date(),
  caregiverName: 'Dr. Sarah Johnson',
  caregiverPhone: '(555) 123-4567',
  caregiverEmail: 'sarah.johnson@careconnect.com',
});

describe('TaskDetailScreen (RNTL component test)', () => {
  it('renders the task details and caregiver card', async () => {
    await renderWithState(<TaskDetailScreen taskId="1" />, {
      seed: {tasks: [taskWithCaregiver]},
    });

    expect(screen.getByText('Take morning medication')).toBeTruthy();
    expect(
      screen.getByText('Take 2 blue pills and 1 white pill with water'),
    ).toBeTruthy();
    expect(screen.getByText('Caregiver')).toBeTruthy();
    expect(screen.getByText('Dr. Sarah Johnson')).toBeTruthy();
    expect(screen.getByText('(555) 123-4567')).toBeTruthy();
  });

  it('omits the caregiver card when no caregiver is set', async () => {
    const bare = makeTask({id: '2', title: 'Evening medication', dueDate: new Date()});
    await renderWithState(<TaskDetailScreen taskId="2" />, {
      seed: {tasks: [bare]},
    });

    expect(screen.getByText('Evening medication')).toBeTruthy();
    expect(screen.queryByText('Caregiver')).toBeNull();
  });

  it('marks the task resolved and fires onResolved', async () => {
    const onResolved = jest.fn();
    await renderWithState(
      <TaskDetailScreen taskId="1" onResolved={onResolved} />,
      {seed: {tasks: [taskWithCaregiver]}},
    );

    await fireEvent.press(screen.getByTestId('task-resolve'));

    expect(onResolved).toHaveBeenCalledTimes(1);
    // Once resolved, the action button disappears.
    expect(screen.queryByTestId('task-resolve')).toBeNull();
  });

  it('hides the resolve button for already-completed tasks', async () => {
    const done = makeTask({
      id: '3',
      title: 'Morning walk',
      dueDate: new Date(),
      completed: true,
    });
    await renderWithState(<TaskDetailScreen taskId="3" />, {
      seed: {tasks: [done]},
    });

    expect(screen.queryByTestId('task-resolve')).toBeNull();
  });

  it('renders a not-found message for an unknown task id', async () => {
    await renderWithState(<TaskDetailScreen taskId="missing" />, {
      seed: {tasks: [taskWithCaregiver]},
    });

    expect(screen.getByTestId('task-not-found')).toBeTruthy();
  });
});
