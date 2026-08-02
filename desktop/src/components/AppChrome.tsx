import React from 'react';
import { MenuBar } from './MenuBar';
import { Toolbar } from './Toolbar';
import type { AppActions } from '../navigation/actions';

/**
 * The persistent application shell. Focus order (§2): skip link → menu bar →
 * toolbar → main content. The navy header carries the brand and a decorative
 * avatar; the avatar is intentionally non-interactive so it stays out of the
 * documented tab sequence.
 */
export function AppChrome({
  actions,
  searchRef,
  children,
}: {
  actions: AppActions;
  searchRef: React.RefObject<HTMLInputElement>;
  children: React.ReactNode;
}) {
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <header className="app-header">
        <span className="app-header__brand">CareConnect</span>
        <MenuBar actions={actions} />
        <div className="app-header__actions" aria-hidden="true">
          <span className="header-avatar">CC</span>
        </div>
      </header>
      <Toolbar actions={actions} ref={searchRef} />
      <main className="app-main" id="main-content">
        {children}
      </main>
    </div>
  );
}
