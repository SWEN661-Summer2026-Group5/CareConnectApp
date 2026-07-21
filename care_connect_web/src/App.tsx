import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { AppShell } from './components/AppShell';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import TaskListScreen from './screens/TaskListScreen';
import { AppStateProvider } from './state/AppState';
import './index.css';

function LoginRoute() {
  return (
    <AppShell>
      <LoginScreen />
    </AppShell>
  );
}

function HomeRoute() {
  const navigate = useNavigate();
  return (
    <AppShell>
      <HomeScreen
        onViewTask={() => navigate('/tasks')}
        onViewAllTasks={() => navigate('/tasks')}
        onOpenMenu={() => navigate('/tasks')}
      />
    </AppShell>
  );
}

function TasksRoute() {
  const navigate = useNavigate();
  return (
    <AppShell>
      <TaskListScreen
        onOpenTask={() => navigate('/tasks')}
        onOpenMenu={() => navigate('/home')}
      />
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
        </Routes>
      </BrowserRouter>
    </AppStateProvider>
  );
}

export default App;
