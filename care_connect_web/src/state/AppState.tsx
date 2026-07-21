import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

// ─── Models (mirrors the React Native / Flutter apps) ───────────────────────

export interface Task {
  id: string;
  title: string;
  details: string;
  dueDate: Date;
  completed: boolean;
  caregiverName: string;
  caregiverPhone: string;
  caregiverEmail: string;
}

export interface Contact {
  id: string;
  name: string;
  role: string;
  phone: string;
  email: string;
}

export function makeTask(
  data: Partial<Task> & { id: string; title: string; dueDate: Date },
): Task {
  return {
    details: '',
    completed: false,
    caregiverName: '',
    caregiverPhone: '',
    caregiverEmail: '',
    ...data,
  };
}

export function makeContact(
  data: Partial<Contact> & { id: string; name: string },
): Contact {
  return { role: '', phone: '', email: '', ...data };
}

export type FontSizeOption = 'small' | 'medium' | 'large' | 'xl';
export type ContrastOption = 'normal' | 'high' | 'xhigh';

export const FONT_SCALE: Record<FontSizeOption, number> = {
  small: 0.85,
  medium: 1.0,
  large: 1.2,
  xl: 1.4,
};

// ─── Seed data (mirrors the mobile apps) ────────────────────────────────────

export function seedTasks(): Task[] {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const at = (hoursFromMidnight: number, dayOffset = 0) =>
    new Date(today.getTime() + (dayOffset * 24 + hoursFromMidnight) * 3600 * 1000);

  return [
    makeTask({
      id: '1',
      title: 'Take morning medication',
      details: 'Take 2 blue pills and 1 white pill with water.',
      dueDate: at(9),
      caregiverName: 'Dr. Sarah Johnson',
      caregiverPhone: '(555) 123-4567',
      caregiverEmail: 'sarah.johnson@careconnect.com',
    }),
    makeTask({
      id: '2',
      title: 'Physical therapy appointment',
      details: 'Bring the exercise log from last week.',
      dueDate: at(14),
      caregiverName: 'Mike Chen',
      caregiverPhone: '(555) 234-5678',
      caregiverEmail: 'mike.chen@careconnect.com',
    }),
    makeTask({ id: '3', title: 'Take evening medication', dueDate: at(19) }),
    makeTask({ id: '4', title: 'Doctor checkup', dueDate: at(10, 1) }),
    makeTask({ id: '5', title: 'Morning walk', dueDate: at(-1), completed: true }),
  ];
}

export function seedContacts(): Contact[] {
  return [
    makeContact({
      id: '1',
      name: 'Dr. Sarah Johnson',
      role: 'Primary Care Physician',
      phone: '(555) 123-4567',
      email: 'sarah.johnson@careconnect.com',
    }),
    makeContact({
      id: '2',
      name: 'Mike Chen',
      role: 'Physical Therapist',
      phone: '(555) 234-5678',
      email: 'mike.chen@careconnect.com',
    }),
    makeContact({
      id: '3',
      name: 'Emily Rodriguez',
      role: 'Home Care Nurse',
      phone: '(555) 345-6789',
      email: 'emily.rodriguez@careconnect.com',
    }),
  ];
}

// ─── Context ─────────────────────────────────────────────────────────────────

export interface AppStateValue {
  tasks: Task[];
  contacts: Contact[];
  fontSizeOption: FontSizeOption;
  contrastOption: ContrastOption;
  sortTasksAsc: boolean;
  sortContactsAsc: boolean;
  searchQuery: string;
  activeTasks: Task[];
  completedTasks: Task[];
  sortedContacts: Contact[];
  fontScale: number;
  addTask: (task: Task) => void;
  markTaskResolved: (id: string) => void;
  addContact: (contact: Contact) => void;
  toggleTaskSort: () => void;
  toggleContactSort: () => void;
  setTaskSort: (asc: boolean) => void;
  setContactSort: (asc: boolean) => void;
  setFontSize: (option: FontSizeOption) => void;
  setContrast: (option: ContrastOption) => void;
  setSearchQuery: (query: string) => void;
}

export interface AppStateSeed {
  tasks?: Task[];
  contacts?: Contact[];
  fontSizeOption?: FontSizeOption;
  contrastOption?: ContrastOption;
}

const AppStateContext = createContext<AppStateValue | null>(null);

function matches(query: string, ...fields: string[]): boolean {
  const q = query.trim().toLowerCase();
  if (q.length === 0) return true;
  return fields.some((f) => f.toLowerCase().includes(q));
}

export function AppStateProvider({
  children,
  seed,
}: {
  children: React.ReactNode;
  seed?: AppStateSeed;
}) {
  const [tasks, setTasks] = useState<Task[]>(() => seed?.tasks ?? seedTasks());
  const [contacts, setContacts] = useState<Contact[]>(
    () => seed?.contacts ?? seedContacts(),
  );
  const [fontSizeOption, setFontSizeOption] = useState<FontSizeOption>(
    seed?.fontSizeOption ?? 'medium',
  );
  const [contrastOption, setContrastOption] = useState<ContrastOption>(
    seed?.contrastOption ?? 'normal',
  );
  const [sortTasksAsc, setSortTasksAsc] = useState(true);
  const [sortContactsAsc, setSortContactsAsc] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const activeTasks = useMemo(
    () =>
      tasks
        .filter((t) => !t.completed)
        .filter((t) => matches(searchQuery, t.title, t.details))
        .sort((a, b) =>
          sortTasksAsc
            ? a.dueDate.getTime() - b.dueDate.getTime()
            : b.dueDate.getTime() - a.dueDate.getTime(),
        ),
    [tasks, sortTasksAsc, searchQuery],
  );

  const completedTasks = useMemo(
    () =>
      tasks
        .filter((t) => t.completed)
        .filter((t) => matches(searchQuery, t.title, t.details)),
    [tasks, searchQuery],
  );

  const sortedContacts = useMemo(
    () =>
      [...contacts]
        .filter((c) => matches(searchQuery, c.name, c.role, c.phone, c.email))
        .sort((a, b) =>
          sortContactsAsc
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name),
        ),
    [contacts, sortContactsAsc, searchQuery],
  );

  const addTask = useCallback((task: Task) => {
    setTasks((prev) => [...prev, task]);
  }, []);

  const markTaskResolved = useCallback((id: string) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: true } : t)));
  }, []);

  const addContact = useCallback((contact: Contact) => {
    setContacts((prev) => [...prev, contact]);
  }, []);

  const toggleTaskSort = useCallback(() => setSortTasksAsc((p) => !p), []);
  const toggleContactSort = useCallback(() => setSortContactsAsc((p) => !p), []);
  const setTaskSort = useCallback((asc: boolean) => setSortTasksAsc(asc), []);
  const setContactSort = useCallback((asc: boolean) => setSortContactsAsc(asc), []);
  const setFontSize = useCallback((o: FontSizeOption) => setFontSizeOption(o), []);
  const setContrast = useCallback((o: ContrastOption) => setContrastOption(o), []);

  const value = useMemo<AppStateValue>(
    () => ({
      tasks,
      contacts,
      fontSizeOption,
      contrastOption,
      sortTasksAsc,
      sortContactsAsc,
      searchQuery,
      activeTasks,
      completedTasks,
      sortedContacts,
      fontScale: FONT_SCALE[fontSizeOption],
      addTask,
      markTaskResolved,
      addContact,
      toggleTaskSort,
      toggleContactSort,
      setTaskSort,
      setContactSort,
      setFontSize,
      setContrast,
      setSearchQuery,
    }),
    [
      tasks,
      contacts,
      fontSizeOption,
      contrastOption,
      sortTasksAsc,
      sortContactsAsc,
      searchQuery,
      activeTasks,
      completedTasks,
      sortedContacts,
      addTask,
      markTaskResolved,
      addContact,
      toggleTaskSort,
      toggleContactSort,
      setTaskSort,
      setContactSort,
      setFontSize,
      setContrast,
    ],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState(): AppStateValue {
  const ctx = useContext(AppStateContext);
  if (!ctx) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return ctx;
}
