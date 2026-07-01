import { useEffect } from 'react';
import { AppStateProvider, AppStateSeed, useAppState } from './state/AppState';
import { ConfirmProvider } from './components/ConfirmProvider';
import AppRouter from './navigation/AppRouter';

/**
 * Applies the user's font-size and contrast preferences to the document root.
 * Font scaling drives the rem-based `--font-scale` variable (WCAG 1.4.4); the
 * contrast attribute swaps the CSS colour palette (WCAG 1.4.3 / 1.4.11).
 */
function ThemeApplier() {
  const { fontScale, contrastOption } = useAppState();
  useEffect(() => {
    document.documentElement.style.setProperty('--font-scale', String(fontScale));
    document.documentElement.setAttribute('data-contrast', contrastOption);
  }, [fontScale, contrastOption]);
  return null;
}

export default function App({ seed }: { seed?: AppStateSeed }) {
  return (
    <AppStateProvider seed={seed}>
      <ThemeApplier />
      <ConfirmProvider>
        <AppRouter />
      </ConfirmProvider>
    </AppStateProvider>
  );
}
