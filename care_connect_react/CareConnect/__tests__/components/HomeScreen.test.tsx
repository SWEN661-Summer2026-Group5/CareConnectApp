import React from 'react';
import {fireEvent, screen} from '@testing-library/react-native';
import HomeScreen from '../../src/screens/HomeScreen';
import {makeTask} from '../../src/state/AppState';
import {renderWithState} from '../../src/test-support/renderWithState';

const twoTasks = [
  makeTask({id: 'a', title: 'Take medication', dueDate: new Date()}),
  makeTask({id: 'b', title: 'Doctor checkup', dueDate: new Date()}),
];

describe('HomeScreen (RNTL component test)', () => {
  it('shows the next task and the following task from app state', async () => {
    await renderWithState(<HomeScreen />, {seed: {tasks: twoTasks}});

    expect(screen.getByText('Next Task')).toBeTruthy();
    expect(screen.getByText('Take medication')).toBeTruthy();
    expect(screen.getByText('Next Up')).toBeTruthy();
    expect(screen.getByText('Doctor checkup')).toBeTruthy();
  });

  it('shows an empty state when there are no active tasks', async () => {
    await renderWithState(<HomeScreen />, {seed: {tasks: []}});

    expect(screen.getByText('No upcoming tasks.')).toBeTruthy();
    expect(screen.queryByText('Next Task')).toBeNull();
  });

  it('passes the next task id to onViewTask', async () => {
    const onViewTask = jest.fn();
    await renderWithState(<HomeScreen onViewTask={onViewTask} />, {
      seed: {tasks: twoTasks},
    });

    await fireEvent.press(screen.getByTestId('home-view-task'));

    expect(onViewTask).toHaveBeenCalledWith('a');
  });

  it('invokes navigation callbacks for "View All Tasks" and "MENU"', async () => {
    const onViewAllTasks = jest.fn();
    const onOpenMenu = jest.fn();
    await renderWithState(
      <HomeScreen onViewAllTasks={onViewAllTasks} onOpenMenu={onOpenMenu} />,
      {seed: {tasks: twoTasks}},
    );

    await fireEvent.press(screen.getByTestId('home-view-all'));
    await fireEvent.press(screen.getByTestId('home-menu'));

    expect(onViewAllTasks).toHaveBeenCalledTimes(1);
    expect(onOpenMenu).toHaveBeenCalledTimes(1);
  });
});
