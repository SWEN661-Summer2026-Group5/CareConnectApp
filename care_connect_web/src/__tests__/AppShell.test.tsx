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

  it('renders the labelled main navigation', () => {
    renderWithProviders(
      <AppShell>
        <p>content</p>
      </AppShell>,
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

  it('offers Sign In while signed out', () => {
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
      screen.queryByRole('link', { name: 'Sign Out' }),
    ).not.toBeInTheDocument();
  });

  it('swaps in Sign Out once signed in', () => {
    renderWithProviders(
      <AppShell>
        <p>content</p>
      </AppShell>,
      { seed: { isSignedIn: true } },
    );

    expect(screen.getByRole('link', { name: 'Sign Out' })).toHaveAttribute(
      'href',
      '/',
    );
    expect(screen.queryByRole('link', { name: 'Sign In' })).not.toBeInTheDocument();
  });

  it('returns to the signed-out nav after Sign Out is activated', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <AppShell>
        <p>content</p>
      </AppShell>,
      { seed: { isSignedIn: true } },
    );

    await user.click(screen.getByRole('link', { name: 'Sign Out' }));

    expect(screen.getByRole('link', { name: 'Sign In' })).toBeInTheDocument();
  });

  it('keeps the decorative header widgets out of the accessibility tree', () => {
    renderWithProviders(
      <AppShell>
        <p>content</p>
      </AppShell>,
    );

    // The widgets are present in the DOM but hidden from assistive tech, so
    // assert on the aria-hidden wrapper — text queries ignore aria-hidden.
    expect(screen.getByText('Alerts').closest('[aria-hidden="true"]')).not.toBeNull();
  });
});
