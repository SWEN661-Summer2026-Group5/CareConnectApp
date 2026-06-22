import React, {useEffect, useRef, useState} from 'react';
import {BackHandler} from 'react-native';
import LoginScreen from '../screens/LoginScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import HomeScreen from '../screens/HomeScreen';
import TaskListScreen from '../screens/TaskListScreen';
import TaskDetailScreen from '../screens/TaskDetailScreen';
import NewTaskScreen from '../screens/NewTaskScreen';
import ContactListScreen from '../screens/ContactListScreen';
import AddContactScreen from '../screens/AddContactScreen';
import MenuScreen from '../screens/MenuScreen';
import OptionsScreen from '../screens/OptionsScreen';

// A minimal screen stack — no native navigation dependency. Each screen
// receives navigation callbacks that push/pop/replace/reset this stack,
// mirroring the push / pushReplacement / pushAndRemoveUntil flows in the
// Flutter app (lib/screens).
type Route =
  | {name: 'Login'}
  | {name: 'ForgotPassword'}
  | {name: 'Home'}
  | {name: 'TaskList'}
  | {name: 'TaskDetail'; taskId: string}
  | {name: 'NewTask'}
  | {name: 'ContactList'}
  | {name: 'AddContact'}
  | {name: 'Menu'}
  | {name: 'Options'};

export default function RootNavigator() {
  const [stack, setStack] = useState<Route[]>([{name: 'Login'}]);
  const current = stack[stack.length - 1];

  const push = (route: Route) => setStack(s => [...s, route]);
  const pop = () => setStack(s => (s.length > 1 ? s.slice(0, -1) : s));
  const replace = (route: Route) => setStack(s => [...s.slice(0, -1), route]);
  const reset = (route: Route) => setStack([route]);

  // Android hardware back button: pop the stack if we can, otherwise let the
  // OS handle it (i.e. exit the app from the root screen). A ref mirrors the
  // current stack so the listener — registered once — always reads fresh depth.
  const stackRef = useRef(stack);
  stackRef.current = stack;

  useEffect(() => {
    const onHardwareBack = () => {
      if (stackRef.current.length > 1) {
        setStack(s => (s.length > 1 ? s.slice(0, -1) : s));
        return true; // handled — stay in the app
      }
      return false; // at root — allow the default behaviour (exit)
    };
    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      onHardwareBack,
    );
    return () => subscription?.remove?.();
  }, []);

  switch (current.name) {
    case 'Login':
      return (
        <LoginScreen
          onSignIn={() => replace({name: 'Home'})}
          onForgotPassword={() => push({name: 'ForgotPassword'})}
        />
      );

    case 'ForgotPassword':
      return <ForgotPasswordScreen onBack={pop} />;

    case 'Home':
      return (
        <HomeScreen
          onViewTask={taskId => push({name: 'TaskDetail', taskId})}
          onViewAllTasks={() => push({name: 'TaskList'})}
          onOpenMenu={() => push({name: 'Menu'})}
        />
      );

    case 'TaskList':
      return (
        <TaskListScreen
          onAddTask={() => push({name: 'NewTask'})}
          onOpenTask={taskId => push({name: 'TaskDetail', taskId})}
          onOpenMenu={() => push({name: 'Menu'})}
        />
      );

    case 'TaskDetail':
      return (
        <TaskDetailScreen
          taskId={current.taskId}
          onResolved={pop}
          onOpenMenu={() => push({name: 'Menu'})}
        />
      );

    case 'NewTask':
      return (
        <NewTaskScreen
          onConfirm={pop}
          onDiscard={pop}
          onOpenMenu={() => push({name: 'Menu'})}
        />
      );

    case 'ContactList':
      return (
        <ContactListScreen
          onAddContact={() => push({name: 'AddContact'})}
          onOpenMenu={() => push({name: 'Menu'})}
        />
      );

    case 'AddContact':
      return (
        <AddContactScreen
          onConfirm={pop}
          onDiscard={pop}
          onOpenMenu={() => push({name: 'Menu'})}
        />
      );

    case 'Menu':
      return (
        <MenuScreen
          onHome={() => replace({name: 'Home'})}
          onTasks={() => replace({name: 'TaskList'})}
          onContacts={() => replace({name: 'ContactList'})}
          onOptions={() => replace({name: 'Options'})}
          onSignOut={() => reset({name: 'Login'})}
        />
      );

    case 'Options':
      return <OptionsScreen onOpenMenu={() => push({name: 'Menu'})} />;

    default:
      return null;
  }
}
