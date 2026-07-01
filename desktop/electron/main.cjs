// CareConnect Desktop — Electron main process.
//
// Responsibilities:
//   1. Create the application window with a secure renderer (context isolation
//      on, node integration off, preload bridge only).
//   2. Build a native application menu (File > Edit > View > Help) whose items
//      carry the keyboard accelerators documented in the Week 7 Accessibility
//      Notes (Section 4). Each app action forwards to the renderer over IPC so
//      the in-window menu bar and the native menu stay in lockstep.
//
// No shortcut uses more than two modifier keys (motor-demand constraint for the
// Parkinsonian-tremor scenario). CmdOrCtrl maps Ctrl on Windows/Linux to Cmd on
// macOS automatically.

const { app, BrowserWindow, Menu, shell } = require('electron');
const path = require('node:path');

const isDev = process.env.ELECTRON_DEV === '1';

/** @type {BrowserWindow | null} */
let mainWindow = null;

function send(action, payload) {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('menu-action', { action, payload });
  }
}

function buildMenu() {
  const isMac = process.platform === 'darwin';

  /** @type {import('electron').MenuItemConstructorOptions[]} */
  const template = [
    // macOS puts an application menu first by convention.
    ...(isMac
      ? [
          {
            label: app.name,
            submenu: [
              { role: 'about' },
              { type: 'separator' },
              { role: 'hide' },
              { role: 'unhide' },
              { type: 'separator' },
              { role: 'quit' },
            ],
          },
        ]
      : []),
    {
      label: 'File',
      submenu: [
        {
          label: 'New Task',
          accelerator: 'CmdOrCtrl+N',
          click: () => send('new-task'),
        },
        {
          label: 'Save / Confirm',
          accelerator: 'CmdOrCtrl+S',
          click: () => send('save'),
        },
        { type: 'separator' },
        {
          label: 'Mark Task Resolved',
          accelerator: 'CmdOrCtrl+R',
          click: () => send('resolve'),
        },
        { type: 'separator' },
        {
          label: 'Sign Out',
          accelerator: 'CmdOrCtrl+Shift+Q',
          click: () => send('sign-out'),
        },
        isMac ? { role: 'close' } : { role: 'quit' },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectAll' },
        { type: 'separator' },
        {
          label: 'Search',
          accelerator: 'CmdOrCtrl+F',
          click: () => send('search'),
        },
      ],
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Go to Home',
          accelerator: 'CmdOrCtrl+H',
          click: () => send('go-home'),
        },
        {
          label: 'Go to Task List',
          accelerator: 'CmdOrCtrl+T',
          click: () => send('go-tasks'),
        },
        {
          label: 'Go to Contacts',
          accelerator: 'CmdOrCtrl+L',
          click: () => send('go-contacts'),
        },
        {
          label: 'Open Settings',
          accelerator: 'CmdOrCtrl+,',
          click: () => send('go-options'),
        },
        { type: 'separator' },
        {
          label: 'Sort Ascending',
          accelerator: 'CmdOrCtrl+Up',
          click: () => send('sort-asc'),
        },
        {
          label: 'Sort Descending',
          accelerator: 'CmdOrCtrl+Down',
          click: () => send('sort-desc'),
        },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
        ...(isDev ? [{ role: 'toggleDevTools' }] : []),
      ],
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'CareConnect Help',
          accelerator: 'F1',
          click: () => send('help'),
        },
        {
          label: 'About CareConnect',
          click: () => send('about'),
        },
      ],
    },
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1100,
    height: 820,
    minWidth: 360, // supports WCAG 1.4.10 reflow testing down to ~320px CSS
    minHeight: 480,
    backgroundColor: '#EEF2F6',
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  // Open real external links in the OS browser, never inside the app window.
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
  } else {
    mainWindow.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  buildMenu();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
