import React from 'react';
import { render } from '@testing-library/react';
import App from '../App';
import { AppStateProvider, AppStateSeed } from '../state/AppState';
import { ConfirmProvider } from '../components/ConfirmProvider';

/** Renders the whole app (starting at the Login screen). */
export function renderApp(seed?: AppStateSeed) {
  return render(<App seed={seed} />);
}

/** Renders a single screen wrapped in the providers it depends on. */
export function renderWithProviders(
  ui: React.ReactElement,
  seed?: AppStateSeed,
) {
  return render(
    <AppStateProvider seed={seed}>
      <ConfirmProvider>{ui}</ConfirmProvider>
    </AppStateProvider>,
  );
}
