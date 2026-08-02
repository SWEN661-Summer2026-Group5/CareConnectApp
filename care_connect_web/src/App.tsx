import React, { useEffect } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useParams,
  useLocation,
} from 'react-router-dom';
import { AppShell } from './components/AppShell';
import { ConfirmProvider } from './components/ConfirmProvider';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import TaskListScreen from './screens/TaskListScreen';
import TaskDetailScreen from './screens/TaskDetailScreen';
import NewTaskScreen from './screens/NewTaskScreen';
import ContactListScreen from './screens/ContactListScreen';
import AddContactScreen from './screens/AddContactScreen';
import OptionsScreen from './screens/OptionsScreen';
import MenuScreen from './screens/MenuScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import { AppStateProvider, useAppState } from './state/AppState';
import type { AppStateSeed } from './state/AppState';
import './index.css';

/**
 * Every screen stays presentational: it receives navigation callbacks as props
 * and never routes itself. All of the routing lives here so the flow between
 * screens can be read in one place.
 */

/**
 * Applies the user's font-size and contrast preferences to the document root
 * (same mechanism as the desktop app). Font scaling drives the rem-based
 * `--font-scale` variable (WCAG 1.4.4); the contrast attribute swaps the CSS
 * colour palette (WCAG 1.4.3 / 1.4.11).
 */
function ThemeApplier() {
  const { fontScale, contrastOption } = useAppState();
  useEffect(() => {
    document.documentElement.style.setProperty('--font-scale', String(fontScale));
    document.documentElement.setAttribute('data-contrast', contrastOption);
  }, [fontScale, contrastOption]);
  return null;
}

/** Signed-out visitors are sent back to the login screen. */
function RequireAuth({ children }: { children: React.ReactElement }) {
  const { isSignedIn } = useAppState();
  if (!isSignedIn) return <Navigate to="/" replace />;
  return children;
}

/**
 * Moves focus to the screen heading after in-app navigation so screen readers
 * announce the new screen (matches the desktop router's behaviour). Pre-auth
 * screens focus their own brand heading instead.
 */
function RouteFocus() {
  const location = useLocation();
  const { setSearchQuery } = useAppState();

  // Clear the search when the screen changes: the query is global (it filters
  // tasks AND contacts), so a leftover query from one screen would silently
  // empty the next one's list.
  useEffect(() => {
    setSearchQuery('');
  }, [location.pathname, setSearchQuery]);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      // Never steal focus from something the user is already interacting
      // with (e.g. a form field) — only claim it when it fell back to body
      // because the previous screen unmounted.
      const active = document.activeElement;
      if (active && active !== document.body) return;
      const heading = document.querySelector<HTMLElement>(
        '#main-content .screen-title',
      );
      heading?.focus();
    });
    return () => cancelAnimationFrame(id);
  }, [location.pathname]);
  return null;
}

function LoginRoute() {
  const navigate = useNavigate();
  const { signIn } = useAppState();
  return (
    <AppShell>
      <LoginScreen
        onSignIn={() => {
          signIn();
          navigate('/home');
        }}
        onForgotPassword={() => navigate('/forgot-password')}
      />
    </AppShell>
  );
}

function HomeRoute() {
  const navigate = useNavigate();
  return (
    <AppShell>
      <HomeScreen
        onViewTask={(taskId) => navigate(`/tasks/${taskId}`)}
        onViewAllTasks={() => navigate('/tasks')}
        onOpenMenu={() => navigate('/menu')}
      />
    </AppShell>
  );
}

function TasksRoute() {
  const navigate = useNavigate();
  return (
    <AppShell>
      <TaskListScreen
        onAddTask={() => navigate('/tasks/new')}
        onOpenTask={(taskId) => navigate(`/tasks/${taskId}`)}
        onOpenMenu={() => navigate('/menu')}
      />
    </AppShell>
  );
}

function TaskDetailRoute() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  return (
    <AppShell>
      <TaskDetailScreen
        taskId={id ?? ''}
        onResolved={() => navigate('/tasks')}
        onBack={() => navigate('/tasks')}
        onOpenMenu={() => navigate('/menu')}
      />
    </AppShell>
  );
}

function NewTaskRoute() {
  const navigate = useNavigate();
  return (
    <AppShell>
      <NewTaskScreen
        onConfirm={() => navigate('/tasks')}
        onDiscard={() => navigate('/tasks')}
        onOpenMenu={() => navigate('/menu')}
      />
    </AppShell>
  );
}

function ContactsRoute() {
  const navigate = useNavigate();
  return (
    <AppShell>
      <ContactListScreen
        onAddContact={() => navigate('/contacts/new')}
        onOpenMenu={() => navigate('/menu')}
      />
    </AppShell>
  );
}

function AddContactRoute() {
  const navigate = useNavigate();
  return (
    <AppShell>
      <AddContactScreen
        onConfirm={() => navigate('/contacts')}
        onDiscard={() => navigate('/contacts')}
        onOpenMenu={() => navigate('/menu')}
      />
    </AppShell>
  );
}

function OptionsRoute() {
  const navigate = useNavigate();
  return (
    <AppShell>
      <OptionsScreen onOpenMenu={() => navigate('/menu')} />
    </AppShell>
  );
}

function MenuRoute() {
  const navigate = useNavigate();
  const { signOut } = useAppState();
  return (
    <AppShell>
      <MenuScreen
        onHome={() => navigate('/home')}
        onTasks={() => navigate('/tasks')}
        onContacts={() => navigate('/contacts')}
        onOptions={() => navigate('/options')}
        onSignOut={() => {
          signOut();
          navigate('/');
        }}
      />
    </AppShell>
  );
}

function ForgotPasswordRoute() {
  const navigate = useNavigate();
  return (
    <AppShell>
      <ForgotPasswordScreen onBack={() => navigate('/')} />
    </AppShell>
  );
}

function guarded(element: React.ReactElement) {
  return <RequireAuth>{element}</RequireAuth>;
}

function App({ seed }: { seed?: AppStateSeed }) {
  return (
    <AppStateProvider seed={seed}>
      <ThemeApplier />
      <BrowserRouter>
        <ConfirmProvider>
          <RouteFocus />
          <Routes>
            <Route path="/" element={<LoginRoute />} />
            <Route path="/home" element={guarded(<HomeRoute />)} />
            <Route path="/tasks" element={guarded(<TasksRoute />)} />
            <Route path="/tasks/new" element={guarded(<NewTaskRoute />)} />
            <Route path="/tasks/:id" element={guarded(<TaskDetailRoute />)} />
            <Route path="/contacts" element={guarded(<ContactsRoute />)} />
            <Route path="/contacts/new" element={guarded(<AddContactRoute />)} />
            <Route path="/options" element={guarded(<OptionsRoute />)} />
            <Route path="/menu" element={guarded(<MenuRoute />)} />
            <Route path="/forgot-password" element={<ForgotPasswordRoute />} />
          </Routes>
        </ConfirmProvider>
      </BrowserRouter>
    </AppStateProvider>
  );
}

export default App;
