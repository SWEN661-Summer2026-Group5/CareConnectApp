import React from 'react';
import { NavLink } from 'react-router-dom';

/**
 * The persistent application shell, matching the CareConnect desktop layout:
 * a teal header carrying the brand + main nav and decorative status widgets
 * (Alerts, Avatar), the main content area, and a footer. Focus order:
 * skip link → nav → main content. The header status widgets are intentionally
 * non-interactive so they stay out of the tab sequence.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <header className="app-header" role="banner">
        <span className="app-header__brand">CareConnect</span>
        <nav aria-label="Main navigation">
          <ul className="app-nav">
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
              <NavLink className="app-nav__link" to="/">
                Sign In
              </NavLink>
            </li>
          </ul>
        </nav>
        <div className="app-header__actions" aria-hidden="true">
          <span className="header-alerts">
            <span aria-hidden="true">🔔</span>
            Alerts
            <span className="header-alerts__badge">3</span>
          </span>
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
