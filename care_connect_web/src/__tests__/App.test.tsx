import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

/**
 * App owns its own BrowserRouter and AppStateProvider, so these tests drive it
 * the way a browser would: push the URL first, then mount. State comes from the
 * default seed data in AppState.
 */
function renderAt(path: string) {
  window.history.pushState(null, '', path);
  return render(<App />);
}

afterEach(() => {
  vi.restoreAllMocks();
  window.history.pushState(null, '', '/');
});

describe('App routing', () => {
  it('renders the login screen at /', () => {
    renderAt('/');

    expect(screen.getByRole('heading', { name: 'Sign In', level: 2 })).toBeInTheDocument();
  });

  it('renders the home screen at /home', () => {
    renderAt('/home');

    expect(screen.getByRole('heading', { name: 'Home', level: 1 })).toBeInTheDocument();
  });

  it('renders the task list at /tasks', () => {
    renderAt('/tasks');

    expect(screen.getByRole('heading', { name: 'Tasks', level: 1 })).toBeInTheDocument();
  });

  it('prefers the static /tasks/new route over the :id route', () => {
    renderAt('/tasks/new');

    expect(
      screen.getByRole('heading', { name: 'Add New Task', level: 1 }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: 'Task Details' }),
    ).not.toBeInTheDocument();
  });

  it('resolves the :id param to the matching task at /tasks/:id', () => {
    renderAt('/tasks/1');

    expect(
      screen.getByRole('heading', { name: 'Task Details', level: 1 }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Take morning medication', level: 2 }),
    ).toBeInTheDocument();
  });

  it('renders the contact screens at /contacts and /contacts/new', () => {
    const { unmount } = renderAt('/contacts');
    expect(
      screen.getByRole('heading', { name: 'Contacts', level: 1 }),
    ).toBeInTheDocument();
    unmount();

    renderAt('/contacts/new');
    expect(
      screen.getByRole('heading', { name: 'Add Contact', level: 1 }),
    ).toBeInTheDocument();
  });

  it('renders the options, menu and forgot-password routes', () => {
    const { unmount: closeOptions } = renderAt('/options');
    expect(
      screen.getByRole('heading', { name: 'Options', level: 1 }),
    ).toBeInTheDocument();
    closeOptions();

    const { unmount: closeMenu } = renderAt('/menu');
    expect(screen.getByRole('heading', { name: 'Menu', level: 1 })).toBeInTheDocument();
    closeMenu();

    renderAt('/forgot-password');
    expect(
      screen.getByRole('heading', { name: 'Reset Password', level: 2 }),
    ).toBeInTheDocument();
  });

  it('navigates from sign-in to /home and marks the user signed in', async () => {
    const user = userEvent.setup();
    renderAt('/');

    await user.type(
      screen.getByLabelText(/email address/i, { selector: 'input' }),
      'carer@example.com',
    );
    await user.type(
      screen.getByLabelText(/password/i, { selector: 'input' }),
      'hunter2',
    );
    await user.click(screen.getByRole('button', { name: 'Sign In' }));

    expect(window.location.pathname).toBe('/home');
    expect(screen.getByRole('heading', { name: 'Home', level: 1 })).toBeInTheDocument();
    // The shell nav reflects the auth flag that LoginRoute set.
    expect(screen.getByRole('link', { name: 'Sign Out' })).toBeInTheDocument();
  });

  it('opens a task detail from the task list', async () => {
    const user = userEvent.setup();
    renderAt('/tasks');

    await user.click(
      screen.getByRole('button', { name: /take morning medication.*opens task details/i }),
    );

    expect(window.location.pathname).toBe('/tasks/1');
    expect(
      screen.getByRole('heading', { name: 'Task Details', level: 1 }),
    ).toBeInTheDocument();
  });

  it('reaches the contact list through the menu', async () => {
    const user = userEvent.setup();
    renderAt('/home');

    await user.click(screen.getByRole('button', { name: 'Open menu' }));
    expect(window.location.pathname).toBe('/menu');

    await user.click(screen.getByRole('button', { name: 'Contacts' }));

    expect(window.location.pathname).toBe('/contacts');
    expect(
      screen.getByRole('heading', { name: 'Contacts', level: 1 }),
    ).toBeInTheDocument();
  });

  it('adds a task through the new-task route and shows it in the list', async () => {
    const user = userEvent.setup();
    renderAt('/tasks/new');

    await user.type(screen.getByLabelText(/task title/i), 'Collect prescription');
    await user.click(screen.getByRole('button', { name: 'Confirm' }));

    expect(window.location.pathname).toBe('/tasks');
    expect(screen.getByText('Collect prescription')).toBeInTheDocument();
  });

  it('signs out from the menu and returns to the login route', async () => {
    const user = userEvent.setup();
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    renderAt('/menu');

    await user.click(screen.getByRole('button', { name: 'Sign Out' }));

    expect(window.location.pathname).toBe('/');
    expect(screen.getByRole('heading', { name: 'Sign In', level: 2 })).toBeInTheDocument();
  });
});
