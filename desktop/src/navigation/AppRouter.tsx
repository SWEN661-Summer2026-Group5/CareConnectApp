import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
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
import { AppChrome } from '../components/AppChrome';
import { ScreenActionsProvider, ScreenHandlers } from './screenActions';
import { AppActions } from './actions';
import { useConfirm } from '../components/ConfirmProvider';
import { getBridge, modKey } from '../utils/bridge';

type Route =
  | { name: 'Login' }
  | { name: 'ForgotPassword' }
  | { name: 'Home' }
  | { name: 'TaskList' }
  | { name: 'TaskDetail'; taskId: string }
  | { name: 'NewTask' }
  | { name: 'ContactList' }
  | { name: 'AddContact' }
  | { name: 'Menu' }
  | { name: 'Options' };

const PRE_AUTH = new Set<Route['name']>(['Login', 'ForgotPassword']);

export default function AppRouter() {
  const [stack, setStack] = useState<Route[]>([{ name: 'Login' }]);
  const current = stack[stack.length - 1];
  const authenticated = !PRE_AUTH.has(current.name);
  const confirm = useConfirm();
  const searchRef = useRef<HTMLInputElement>(null);

  const push = useCallback((route: Route) => setStack((s) => [...s, route]), []);
  const pop = useCallback(
    () => setStack((s) => (s.length > 1 ? s.slice(0, -1) : s)),
    [],
  );
  const replace = useCallback(
    (route: Route) => setStack((s) => [...s.slice(0, -1), route]),
    [],
  );
  const reset = useCallback((route: Route) => setStack([route]), []);

  // ── Context-sensitive handlers published by the mounted screen ──────────
  const screenHandlers = useRef<ScreenHandlers>({});
  const register = useCallback((h: ScreenHandlers) => {
    screenHandlers.current = h;
  }, []);

  // ── Move focus to the page heading after navigation (§2.7) ──────────────
  useEffect(() => {
    if (!authenticated) return; // pre-auth screens focus their own heading
    const id = requestAnimationFrame(() => {
      const heading = document.querySelector<HTMLElement>(
        '#main-content .screen-title',
      );
      heading?.focus();
    });
    return () => cancelAnimationFrame(id);
  }, [current, authenticated]);

  // ── Application actions (single source of truth) ────────────────────────
  const actions = useMemo<AppActions>(
    () => ({
      newTask: () => {
        if (authenticated) push({ name: 'NewTask' });
      },
      save: () => screenHandlers.current.onSave?.(),
      resolve: () => screenHandlers.current.onResolve?.(),
      signOut: async () => {
        if (!authenticated) return;
        const ok = await confirm({
          title: 'Sign out of CareConnect?',
          message: 'You will need to sign in again to manage your tasks.',
          confirmLabel: 'Sign Out',
          cancelLabel: 'Stay Signed In',
          destructive: true,
        });
        if (ok) reset({ name: 'Login' });
      },
      search: () => searchRef.current?.focus(),
      goHome: () => authenticated && replace({ name: 'Home' }),
      goTasks: () => authenticated && replace({ name: 'TaskList' }),
      goContacts: () => authenticated && replace({ name: 'ContactList' }),
      goOptions: () => authenticated && replace({ name: 'Options' }),
      sortAsc: () => screenHandlers.current.onSortAsc?.(),
      sortDesc: () => screenHandlers.current.onSortDesc?.(),
      help: () => {
        const m = modKey();
        void confirm({
          title: 'CareConnect Help',
          message:
            `Keyboard shortcuts: New Task ${m}+N, Save/Confirm ${m}+S, ` +
            `Search ${m}+F, Settings ${m}+comma, Mark Resolved ${m}+R, ` +
            `Home ${m}+H, Tasks ${m}+T, Contacts ${m}+L, Sort ${m}+Up/Down, ` +
            `Sign Out ${m}+Shift+Q. Use Tab and Enter to reach every action ` +
            `without holding keys.`,
          confirmLabel: 'Close',
          cancelLabel: 'Close',
        });
      },
      about: () => {
        void confirm({
          title: 'About CareConnect Desktop',
          message:
            'CareConnect Desktop — an accessible task and care manager. ' +
            'SWEN 661 Group 5, Week 7. WCAG 2.1 Level AA.',
          confirmLabel: 'Close',
          cancelLabel: 'Close',
        });
      },
    }),
    [authenticated, confirm, push, replace, reset],
  );

  // ── Native menu (Electron) → actions over IPC ───────────────────────────
  useEffect(() => {
    const bridge = getBridge();
    if (!bridge) return;
    const map: Record<string, keyof AppActions> = {
      'new-task': 'newTask',
      save: 'save',
      resolve: 'resolve',
      'sign-out': 'signOut',
      search: 'search',
      'go-home': 'goHome',
      'go-tasks': 'goTasks',
      'go-contacts': 'goContacts',
      'go-options': 'goOptions',
      'sort-asc': 'sortAsc',
      'sort-desc': 'sortDesc',
      help: 'help',
      about: 'about',
    };
    return bridge.onMenuAction((action) => {
      const key = map[action];
      if (key) actions[key]();
    });
  }, [actions]);

  // ── Keyboard fallback for the browser/tests (no native menu present) ─────
  useEffect(() => {
    if (getBridge()) return; // Electron's native menu owns the accelerators
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F1') {
        e.preventDefault();
        actions.help();
        return;
      }
      const mod = e.ctrlKey || e.metaKey;
      if (!mod) return;
      const k = e.key.toLowerCase();
      const run = (fn: () => void) => {
        e.preventDefault();
        fn();
      };
      if (e.shiftKey && k === 'q') return run(actions.signOut);
      if (e.shiftKey) return;
      switch (k) {
        case 'n':
          return run(actions.newTask);
        case 's':
          return run(actions.save);
        case 'f':
          return run(actions.search);
        case 'r':
          return run(actions.resolve);
        case ',':
          return run(actions.goOptions);
        case 'h':
          return run(actions.goHome);
        case 't':
          return run(actions.goTasks);
        case 'l':
          return run(actions.goContacts);
        case 'arrowup':
          return run(actions.sortAsc);
        case 'arrowdown':
          return run(actions.sortDesc);
        default:
          break;
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [actions]);

  // ── Screen rendering ────────────────────────────────────────────────────
  let screen: React.ReactNode;
  switch (current.name) {
    case 'Login':
      return (
        <LoginScreen
          onSignIn={() => replace({ name: 'Home' })}
          onForgotPassword={() => push({ name: 'ForgotPassword' })}
        />
      );
    case 'ForgotPassword':
      return <ForgotPasswordScreen onBack={pop} />;
    case 'Home':
      screen = (
        <HomeScreen
          onViewTask={(taskId) => push({ name: 'TaskDetail', taskId })}
          onViewAllTasks={() => push({ name: 'TaskList' })}
          onOpenMenu={() => push({ name: 'Menu' })}
        />
      );
      break;
    case 'TaskList':
      screen = (
        <TaskListScreen
          onAddTask={() => push({ name: 'NewTask' })}
          onOpenTask={(taskId) => push({ name: 'TaskDetail', taskId })}
          onOpenMenu={() => push({ name: 'Menu' })}
        />
      );
      break;
    case 'TaskDetail':
      screen = (
        <TaskDetailScreen
          taskId={current.taskId}
          onResolved={pop}
          onBack={pop}
          onOpenMenu={() => push({ name: 'Menu' })}
        />
      );
      break;
    case 'NewTask':
      screen = (
        <NewTaskScreen
          onConfirm={pop}
          onDiscard={pop}
          onOpenMenu={() => push({ name: 'Menu' })}
        />
      );
      break;
    case 'ContactList':
      screen = (
        <ContactListScreen
          onAddContact={() => push({ name: 'AddContact' })}
          onOpenMenu={() => push({ name: 'Menu' })}
        />
      );
      break;
    case 'AddContact':
      screen = (
        <AddContactScreen
          onConfirm={pop}
          onDiscard={pop}
          onOpenMenu={() => push({ name: 'Menu' })}
        />
      );
      break;
    case 'Menu':
      screen = (
        <MenuScreen
          onHome={() => replace({ name: 'Home' })}
          onTasks={() => replace({ name: 'TaskList' })}
          onContacts={() => replace({ name: 'ContactList' })}
          onOptions={() => replace({ name: 'Options' })}
          onSignOut={() => reset({ name: 'Login' })}
        />
      );
      break;
    case 'Options':
      screen = <OptionsScreen onOpenMenu={() => push({ name: 'Menu' })} />;
      break;
    default:
      screen = null;
  }

  return (
    <ScreenActionsProvider register={register}>
      <AppChrome actions={actions} searchRef={searchRef}>
        {screen}
      </AppChrome>
    </ScreenActionsProvider>
  );
}
