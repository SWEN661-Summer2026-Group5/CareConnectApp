import React from 'react';
import {fireEvent, screen} from '@testing-library/react-native';
import TaskListScreen from '../../src/screens/TaskListScreen';
import {makeTask} from '../../src/state/AppState';
import {renderWithState} from '../../src/test-support/renderWithState';

const seedTasks = [
  makeTask({id: '1', title: 'Morning medication', dueDate: new Date()}),
  makeTask({id: '2', title: 'Physical therapy', dueDate: new Date()}),
  makeTask({
    id: '3',
    title: 'Completed walk',
    dueDate: new Date(),
    completed: true,
  }),
];

describe('TaskListScreen (RNTL component test)', () => {
  it('lists active tasks with the active count', async () => {
    await renderWithState(<TaskListScreen />, {seed: {tasks: seedTasks}});

    expect(screen.getByText('Active (2)')).toBeTruthy();
    expect(screen.getByText('Morning medication')).toBeTruthy();
    expect(screen.getByText('Physical therapy')).toBeTruthy();
  });

  it('hides completed tasks until the toggle is pressed', async () => {
    await renderWithState(<TaskListScreen />, {seed: {tasks: seedTasks}});

    expect(screen.getByText('1 Completed')).toBeTruthy();
    expect(screen.queryByText('Completed walk')).toBeNull();

    await fireEvent.press(screen.getByTestId('tasks-completed-toggle'));

    expect(screen.getByText('Completed walk')).toBeTruthy();
  });

  it('opens a task by id', async () => {
    const onOpenTask = jest.fn();
    await renderWithState(<TaskListScreen onOpenTask={onOpenTask} />, {
      seed: {tasks: seedTasks},
    });

    await fireEvent.press(screen.getByTestId('task-card-1'));

    expect(onOpenTask).toHaveBeenCalledWith('1');
  });

  it('toggles the sort direction indicator', async () => {
    await renderWithState(<TaskListScreen />, {seed: {tasks: seedTasks}});

    const sortButton = screen.getByTestId('tasks-sort');
    expect(sortButton.props.accessibilityState.selected).toBe(true);

    await fireEvent.press(sortButton);

    expect(
      screen.getByTestId('tasks-sort').props.accessibilityState.selected,
    ).toBe(false);
  });

  it('fires add-task and menu callbacks', async () => {
    const onAddTask = jest.fn();
    const onOpenMenu = jest.fn();
    await renderWithState(
      <TaskListScreen onAddTask={onAddTask} onOpenMenu={onOpenMenu} />,
      {seed: {tasks: seedTasks}},
    );

    await fireEvent.press(screen.getByTestId('tasks-add'));
    await fireEvent.press(screen.getByTestId('tasks-menu'));

    expect(onAddTask).toHaveBeenCalledTimes(1);
    expect(onOpenMenu).toHaveBeenCalledTimes(1);
  });
});
