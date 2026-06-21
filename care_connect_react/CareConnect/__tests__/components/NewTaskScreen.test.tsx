import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react-native';
import NewTaskScreen from '../../src/screens/NewTaskScreen';
import TaskListScreen from '../../src/screens/TaskListScreen';
import {AppStateProvider} from '../../src/state/AppState';
import {renderWithState} from '../../src/test-support/renderWithState';

describe('NewTaskScreen (RNTL component test)', () => {
  it('renders the form fields', async () => {
    await renderWithState(<NewTaskScreen />, {seed: {tasks: []}});

    expect(screen.getByText('Add New Task')).toBeTruthy();
    expect(screen.getByTestId('new-task-title')).toBeTruthy();
    expect(screen.getByTestId('new-task-details')).toBeTruthy();
  });

  it('does not confirm when the title is empty', async () => {
    const onConfirm = jest.fn();
    await renderWithState(<NewTaskScreen onConfirm={onConfirm} />, {
      seed: {tasks: []},
    });

    await fireEvent.press(screen.getByTestId('new-task-confirm'));

    expect(onConfirm).not.toHaveBeenCalled();
  });

  it('adds the task to shared state and fires onConfirm', async () => {
    const onConfirm = jest.fn();

    // Render the form and the list under the SAME provider so we can observe
    // that the new task actually lands in shared app state.
    await render(
      <AppStateProvider seed={{tasks: []}}>
        <NewTaskScreen onConfirm={onConfirm} />
        <TaskListScreen />
      </AppStateProvider>,
    );

    expect(screen.getByText('Active (0)')).toBeTruthy();

    await fireEvent.changeText(
      screen.getByTestId('new-task-title'),
      'Refill prescription',
    );
    await fireEvent.press(screen.getByTestId('new-task-confirm'));

    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Active (1)')).toBeTruthy();
    expect(screen.getByText('Refill prescription')).toBeTruthy();
  });

  it('fires discard and menu callbacks', async () => {
    const onDiscard = jest.fn();
    const onOpenMenu = jest.fn();
    await renderWithState(
      <NewTaskScreen onDiscard={onDiscard} onOpenMenu={onOpenMenu} />,
      {seed: {tasks: []}},
    );

    await fireEvent.press(screen.getByTestId('new-task-discard'));
    await fireEvent.press(screen.getByTestId('new-task-menu'));

    expect(onDiscard).toHaveBeenCalledTimes(1);
    expect(onOpenMenu).toHaveBeenCalledTimes(1);
  });
});
