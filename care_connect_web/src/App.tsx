import { BrowserRouter, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { AppShell } from './components/AppShell';
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
import './index.css';

/**
 * Every screen stays presentational: it receives navigation callbacks as props
 * and never routes itself. All of the routing lives here so the flow between
 * screens can be read in one place.
 */

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

function App() {
  return (
    <AppStateProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginRoute />} />
          <Route path="/home" element={<HomeRoute />} />
          <Route path="/tasks" element={<TasksRoute />} />
          <Route path="/tasks/new" element={<NewTaskRoute />} />
          <Route path="/tasks/:id" element={<TaskDetailRoute />} />
          <Route path="/contacts" element={<ContactsRoute />} />
          <Route path="/contacts/new" element={<AddContactRoute />} />
          <Route path="/options" element={<OptionsRoute />} />
          <Route path="/menu" element={<MenuRoute />} />
          <Route path="/forgot-password" element={<ForgotPasswordRoute />} />
        </Routes>
      </BrowserRouter>
    </AppStateProvider>
  );
}

export default App;
