// Application-level actions shared by the native menu (via IPC), the in-window
// menu bar, the toolbar, and the keyboard-shortcut layer. A single source of
// truth keeps every entry point behaving identically (§3.2.3 Consistent Nav).

export interface AppActions {
  newTask: () => void;
  save: () => void;
  resolve: () => void;
  signOut: () => void;
  search: () => void;
  goHome: () => void;
  goTasks: () => void;
  goContacts: () => void;
  goOptions: () => void;
  sortAsc: () => void;
  sortDesc: () => void;
  help: () => void;
  about: () => void;
}
