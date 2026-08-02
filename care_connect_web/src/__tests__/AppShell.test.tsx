import { describe, expect, it } from 'vitest';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AppShell } from '../components/AppShell';
import { renderWithProviders } from '../test-support/renderWithProviders';

describe('AppShell', () => {
  it('renders a skip link that targets the main landmark', () => {
    renderWithProviders(
      <AppShell>
        <p>content</p>
      </AppShell>,
    );

    const skip = screen.getByRole('link', { name: 'Skip to main content' });
    expect(skip).toHaveAttribute('href', '#main-content');
    expect(screen.getByRole('main')).toHaveAttribute('id', 'main-content');
  });

  it('renders the banner landmark with the brand', () => {
    renderWithProviders(
      <AppShell>
        <p>content</p>
      </AppShell>,
    );

    expect(
      within(screen.getByRole('banner')).getByText('CareConnect'),
    ).toBeInTheDocument();
  });

  it('renders the full labelled navigation once signed in', () => {
    renderWithProviders(
      <AppShell>
        <p>content</p>
      </AppShell>,
      { seed: { isSignedIn: true } },
    );

    const nav = screen.getByRole('navigation', { name: 'Main navigation' });
    expect(within(nav).getByRole('link', { name: 'Home' })).toHaveAttribute(
      'href',
      '/home',
    );
    expect(within(nav).getByRole('link', { name: 'Tasks' })).toHaveAttribute(
      'href',
      '/tasks',
    );
    expect(within(nav).getByRole('link', { name: 'Contacts' })).toHaveAttribute(
      'href',
      '/contacts',
    );
    expect(within(nav).getByRole('link', { name: 'Options' })).toHaveAttribute(
      'href',
      '/options',
    );
    expect(
      within(nav).getByRole('button', { name: 'Sign Out' }),
    ).toBeInTheDocument();
  });

  it('shows the search field only when signed in', () => {
    const { unmount } = renderWithProviders(
      <AppShell>
        <p>content</p>
      </AppShell>,
      { seed: { isSignedIn: true } },
    );
    expect(screen.getByRole('searchbox', { name: /search/i })).toBeInTheDocument();
    unmount();

    renderWithProviders(
      <AppShell>
        <p>content</p>
      </AppShell>,
      { seed: { isSignedIn: false } },
    );
    expect(screen.queryByRole('searchbox')).not.toBeInTheDocument();
  });

  it('renders the main landmark with its children', () => {
    renderWithProviders(
      <AppShell>
        <p>screen content</p>
      </AppShell>,
    );

    expect(
      within(screen.getByRole('main')).getByText('screen content'),
    ).toBeInTheDocument();
  });

  it('renders the contentinfo footer', () => {
    renderWithProviders(
      <AppShell>
        <p>content</p>
      </AppShell>,
    );

    expect(screen.getByRole('contentinfo')).toHaveTextContent(
      /accessible care management/i,
    );
  });

  it('offers only Sign In while signed out', () => {
    renderWithProviders(
      <AppShell>
        <p>content</p>
      </AppShell>,
      { seed: { isSignedIn: false } },
    );

    expect(screen.getByRole('link', { name: 'Sign In' })).toHaveAttribute(
      'href',
      '/',
    );
    expect(
      screen.queryByRole('button', { name: 'Sign Out' }),
    ).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Tasks' })).not.toBeInTheDocument();
  });

  it('swaps in Sign Out once signed in', () => {
    renderWithProviders(
      <AppShell>
        <p>content</p>
      </AppShell>,
      { seed: { isSignedIn: true } },
    );

    expect(
      screen.getByRole('button', { name: 'Sign Out' }),
    ).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Sign In' })).not.toBeInTheDocument();
  });

  it('signs out only after the confirmation dialog is accepted', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <AppShell>
        <p>content</p>
      </AppShell>,
      { seed: { isSignedIn: true } },
    );

    await user.click(screen.getByRole('button', { name: 'Sign Out' }));
    // Still signed in until the dialog is confirmed.
    const dialog = screen.getByRole('dialog', { name: /sign out of careconnect/i });
    await user.click(within(dialog).getByRole('button', { name: 'Sign Out' }));

    expect(screen.getByRole('link', { name: 'Sign In' })).toBeInTheDocument();
  });

  it('stays signed in when the sign-out dialog is dismissed', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <AppShell>
        <p>content</p>
      </AppShell>,
      { seed: { isSignedIn: true } },
    );

    await user.click(screen.getByRole('button', { name: 'Sign Out' }));
    const dialog = screen.getByRole('dialog', { name: /sign out of careconnect/i });
    await user.click(
      within(dialog).getByRole('button', { name: 'Stay Signed In' }),
    );

    expect(screen.queryByRole('link', { name: 'Sign In' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign Out' })).toBeInTheDocument();
  });

  it('keeps the decorative header avatar out of the accessibility tree', () => {
    renderWithProviders(
      <AppShell>
        <p>content</p>
      </AppShell>,
    );

    // The avatar is present in the DOM but hidden from assistive tech, so
    // assert on the aria-hidden wrapper — text queries ignore aria-hidden.
    expect(screen.getByText('CC').closest('[aria-hidden="true"]')).not.toBeNull();
  });
});
