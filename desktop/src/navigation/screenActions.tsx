import React, { createContext, useContext, useEffect } from 'react';

// Lets the currently mounted screen expose context-sensitive handlers (Save,
// Mark Resolved, Sort) so the global menu/shortcut layer can invoke them
// without the router needing to know each screen's internals.

export interface ScreenHandlers {
  onSave?: () => void;
  onResolve?: () => void;
  onSortAsc?: () => void;
  onSortDesc?: () => void;
}

type Register = (handlers: ScreenHandlers) => void;

const ScreenActionsContext = createContext<Register | null>(null);

export function ScreenActionsProvider({
  register,
  children,
}: {
  register: Register;
  children: React.ReactNode;
}) {
  return (
    <ScreenActionsContext.Provider value={register}>
      {children}
    </ScreenActionsContext.Provider>
  );
}

/** Screens call this to publish their context actions while mounted. */
export function useScreenActions(handlers: ScreenHandlers, deps: unknown[]) {
  const register = useContext(ScreenActionsContext);
  useEffect(() => {
    register?.(handlers);
    return () => register?.({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
