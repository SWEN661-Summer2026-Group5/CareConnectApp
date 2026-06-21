import React from 'react';
import {render} from '@testing-library/react-native';
import {AppStateProvider, AppStateSeed} from '../state/AppState';

// Renders a component wrapped in the AppState context so screens that call
// useAppState() work in isolation. Pass `seed` to inject deterministic data.
export function renderWithState(
  ui: React.ReactElement,
  options?: {seed?: AppStateSeed},
) {
  return render(
    <AppStateProvider seed={options?.seed}>{ui}</AppStateProvider>,
  );
}
