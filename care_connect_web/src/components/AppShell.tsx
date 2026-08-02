import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAppState } from '../state/AppState';
import { useConfirm } from './ConfirmProvider';

/**
 * The persistent application shell, matching the CareConnect desktop layout:
 * a teal header carrying the brand + main nav and a decorative avatar,
 * the main content area, and a footer. Focus order:
 * skip link → nav → search → main content. The header status widgets are
 * intentionally non-interactive so they stay out of the tab sequence.
 *
 * While signed out only the Sign In link is shown; the full navigation (and
 * search) appears once authenticated, mirroring the desktop app's chrome.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  const { isSignedIn, signOut, searchQuery, setSearchQuery } = useAppState();
  const navigate = useNavigate();
  const confirm = useConfirm();

  const onSignOut = async () => {
    const ok = await confirm({
      title: 'Sign out of CareConnect?',
      message: 'You will need to sign in again to manage your tasks.',
      confirmLabel: 'Sign Out',
      cancelLabel: 'Stay Signed In',
      destructive: true,
    });
    if (!ok) return;
    signOut();
    navigate('/');
  };

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <header className="app-header" role="banner">
        <span className="app-header__brand">CareConnect</span>
        <nav aria-label="Main navigation">
          <ul className="app-nav">
            {isSignedIn ? (
              <>
                <li>
                  <NavLink className="app-nav__link" to="/home">
                    Home
                  </NavLink>
                </li>
                <li>
                  <NavLink className="app-nav__link" to="/tasks">
                    Tasks
                  </NavLink>
                </li>
                <li>
                  <NavLink className="app-nav__link" to="/contacts">
                    Contacts
                  </NavLink>
                </li>
                <li>
                  <NavLink className="app-nav__link" to="/options">
                    Options
                  </NavLink>
                </li>
                <li>
                  <button
                    type="button"
                    className="app-nav__link app-nav__button"
                    onClick={onSignOut}
                  >
                    Sign Out
                  </button>
                </li>
              </>
            ) : (
              <li>
                <NavLink className="app-nav__link" to="/">
                  Sign In
                </NavLink>
              </li>
            )}
          </ul>
        </nav>
        {isSignedIn && (
          <div className="header-search">
            <label htmlFor="header-search">
              <span aria-hidden="true">🔍</span> Search
            </label>
            <input
              id="header-search"
              type="search"
              value={searchQuery}
              placeholder="Search tasks and contacts"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        )}
        <div className="app-header__actions" aria-hidden="true">
          <span className="header-avatar">CC</span>
        </div>
      </header>
      <main className="app-main" id="main-content">
        {children}
      </main>
      <footer className="app-footer" role="contentinfo">
        <p>CareConnect &copy; 2026 — Accessible care management</p>
      </footer>
    </div>
  );
}
