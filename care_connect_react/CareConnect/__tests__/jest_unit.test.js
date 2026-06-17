// AppState.test.js
import { AppState, FontSizeOption, ContrastOption, Task, Contact, formatDueDate, buildTheme } from '../AppState';

describe('CareConnect AppState & Utility Unit Tests (SWEN 661 Coverage)', () => {
  let appState;

  beforeEach(() => {
    appState = new AppState();
  });

  // 1. Initialization
  test('Initial State Initialization Verification', () => {
    expect(appState.fontSizeOption).toBe(FontSizeOption.medium);
    expect(appState.contrastOption).toBe(ContrastOption.normal);
    expect(appState.sortTasksAsc).toBe(true);
    expect(appState.sortContactsAsc).toBe(true);
    
    expect(appState.completedTasks.length).toBe(1);
    expect(appState.activeTasks.length).toBe(4);
    expect(appState.sortedContacts.length).toBe(3);
  });

  // 2. Task Management
  test('Task Management Mutation Operations', () => {
    const initialActiveCount = appState.activeTasks.length;
    const newTask = new Task({
      id: '99',
      title: 'Physical Therapy Exercise',
      dueDate: new Date(Date.now() + 2 * 60 * 60 * 1000),
    });

    appState.addTask(newTask);
    expect(appState.activeTasks.length).toBe(initialActiveCount + 1);

    appState.markTaskResolved('99');
    expect(appState.completedTasks.some(t => t.id === '99')).toBe(true);
  });

  // 3. Contact Management
  test('Contact Management Operations', () => {
    const initialContactCount = appState.sortedContacts.length;
    const newContact = new Contact({
      id: '100',
      name: 'Zack Alpha Caregiver',
      role: 'Emergency Contact',
      phone: '555-0000',
      email: 'zack@care.com',
    });

    appState.addContact(newContact);
    expect(appState.sortedContacts.length).toBe(initialContactCount + 1);
  });

  // 4. Sorting
  test('Task and Contact Sorting Inversion Logic', () => {
    expect(appState.sortTasksAsc).toBe(true);
    appState.toggleTaskSort();
    expect(appState.sortTasksAsc).toBe(false);

    expect(appState.sortContactsAsc).toBe(true);
    appState.toggleContactSort();
    expect(appState.sortContactsAsc).toBe(false);
  });

  // 5. Accessibility (Font Scale)
  test('Font Scale Matrix Edge Cases', () => {
    appState.setFontSize(FontSizeOption.small);
    expect(appState.fontScale).toBe(0.85);

    appState.setFontSize(FontSizeOption.medium);
    expect(appState.fontScale).toBe(1.0);

    appState.setFontSize(FontSizeOption.large);
    expect(appState.fontScale).toBe(1.2);
  });

  // 6. Date Formatting
  test('Utility Date Formatting Engine', () => {
    // Note: JS Date mocking might be needed depending on your system timezone
    // Using a fixed mock date is recommended for production tests
    const now = new Date();
    const todayTest = new Date(now.setHours(14, 30, 0, 0));
    expect(formatDueDate(todayTest)).toBe('Today at 2:30 PM');
  });

  // 7. Themes
  test('Theme Generator Matrix Evaluations', () => {
    const normalTheme = buildTheme(ContrastOption.normal);
    expect(normalTheme.scaffoldBackgroundColor).toBe('#EEF2F6');
    expect(normalTheme.primaryColor).toBe('#0B7074');
  });
});