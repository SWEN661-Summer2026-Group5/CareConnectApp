import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppStateProvider } from '../state/AppState';
import type { AppStateSeed } from '../state/AppState';
import { ConfirmProvider } from '../components/ConfirmProvider';

/**
 * Renders a single screen wrapped in the providers it depends on. MemoryRouter
 * stands in for BrowserRouter so NavLink/useNavigate work without a real URL
 * bar; `route` seeds the starting entry for components that read location.
 */
export function renderWithProviders(
  ui: React.ReactElement,
  { seed, route = '/' }: { seed?: AppStateSeed; route?: string } = {},
) {
  return render(
    <AppStateProvider seed={seed}>
      <MemoryRouter initialEntries={[route]}>
        <ConfirmProvider>{ui}</ConfirmProvider>
      </MemoryRouter>
    </AppStateProvider>,
  );
}
