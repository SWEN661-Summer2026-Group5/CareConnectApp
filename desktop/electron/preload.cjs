// Secure bridge between the native menu (main process) and the renderer.
// Exposes a tiny, allow-listed API — no direct Node access reaches the page.

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('careconnect', {
  platform: process.platform,
  /**
   * Subscribe to native-menu actions. Returns an unsubscribe function.
   * @param {(action: string, payload?: unknown) => void} handler
   */
  onMenuAction(handler) {
    const listener = (_event, { action, payload }) => handler(action, payload);
    ipcRenderer.on('menu-action', listener);
    return () => ipcRenderer.removeListener('menu-action', listener);
  },
});
