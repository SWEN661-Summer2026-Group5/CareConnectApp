// Typed access to the preload bridge. In the browser test environment the
// bridge is absent, so every helper degrades gracefully.

export type MenuActionHandler = (action: string, payload?: unknown) => void;

interface CareConnectBridge {
  platform: string;
  onMenuAction(handler: MenuActionHandler): () => void;
}

declare global {
  interface Window {
    careconnect?: CareConnectBridge;
  }
}

export function getBridge(): CareConnectBridge | undefined {
  return typeof window !== 'undefined' ? window.careconnect : undefined;
}

export function isMac(): boolean {
  const platform = getBridge()?.platform;
  if (platform) return platform === 'darwin';
  return typeof navigator !== 'undefined' && /Mac/i.test(navigator.platform);
}

/** Renders "Ctrl" or "Cmd" depending on platform, for on-screen shortcut hints. */
export function modKey(): string {
  return isMac() ? 'Cmd' : 'Ctrl';
}
