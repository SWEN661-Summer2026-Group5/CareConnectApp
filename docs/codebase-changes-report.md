# CareConnect — Application Codebase Changes Report

**Project:** SWEN 661 Group 5 — CareConnect
**Module:** `care_connect_react/CareConnect` (React Native 0.86, React 19, TypeScript)
**Date:** 2026-06-20

---

## 1. Summary

This report documents the application code added to the React Native version of
CareConnect to make it a runnable, testable app. Prior to these changes the React
Native module contained only the default React Native template (`App.tsx` rendered
`NewAppScreen`) plus a standalone logic class (`AppState.js`) exercised by unit
tests — there were **no rendered screens** and nothing was wired into the running
app.

The work delivered three things:

1. A faithful React Native port of the ten CareConnect screens that previously
   existed only in the Flutter app (`care_connect_app/lib/screens`).
2. A shared application‑state layer (React Context) backing those screens.
3. A lightweight in‑app navigator that wires the screens into the running app,
   including Android hardware back‑button handling.

All additions are **new files** except `App.tsx`, which was modified to mount the
new provider and navigator. No previously existing source or tests were changed.

---

## 2. Scope of change

| Area | Files added | Files modified |
| --- | --- | --- |
| Application state | 1 | 0 |
| Screens | 10 | 0 |
| Shared UI primitives | 1 | 0 |
| Utilities | 1 | 0 |
| Navigation | 1 | 0 |
| App entry point | 0 | 1 (`App.tsx`) |
| Test support (non‑production) | 1 | 0 |

Approximate size: **~1,400 lines** of new application/navigation TypeScript.

---

## 3. Detailed changes

### 3.1 Application state — `src/state/AppState.tsx`

A React Context port of the Flutter `AppState` (`care_connect_app/lib/main.dart`).

- **Models:** `Task` and `Contact` interfaces plus `makeTask` / `makeContact`
  factories that apply the same field defaults as the Flutter constructors.
- **Seed data:** `seedTasks()` / `seedContacts()` reproduce the same 5 tasks
  (4 active, 1 completed) and 3 contacts as the original app.
- **Provider/hook:** `AppStateProvider` holds tasks, contacts, font‑size and
  contrast options, and sort flags in React state. `useAppState()` exposes the
  value and throws if used outside the provider.
- **Derived data:** `activeTasks`, `completedTasks`, `sortedContacts`, and
  `fontScale` are computed with `useMemo`, mirroring the Flutter getters
  (including ascending/descending sort).
- **Mutators:** `addTask`, `markTaskResolved`, `addContact`, `toggleTaskSort`,
  `toggleContactSort`, `setFontSize`, `setContrast` — each produces new state so
  React re‑renders.
- **Test seam:** the provider accepts an optional `seed` prop so tests can inject
  deterministic tasks/contacts/options.

> Note: the pre‑existing `AppState.js` (used by the original unit tests) was left
> untouched. The new context is a separate, UI‑driving state layer so the existing
> unit tests continue to pass unchanged.

### 3.2 Screens — `src/screens/*.tsx`

Ten screens ported from the Flutter app. Each is a function component that reads
data through `useAppState()` (where relevant) and receives **navigation callbacks
as props** rather than depending on a router — this keeps each screen isolated and
directly testable.

| Screen | Key behavior |
| --- | --- |
| `LoginScreen` | Email/password fields, SHOW/HIDE toggle; "Sign In" only fires when both fields are non‑empty; "Forgot Password?" link. |
| `ForgotPasswordScreen` | Reset form that swaps to a confirmation message after submit; "Back to Login". |
| `HomeScreen` | "Next Task" / "Next Up" cards from state, empty state, and View Task / View All / MENU actions. |
| `TaskListScreen` | Active list with count, expandable completed section, sort toggle, tappable task cards. |
| `TaskDetailScreen` | Task details + caregiver card, "Mark as Resolved" (hidden once complete), not‑found guard. |
| `NewTaskScreen` | Title/details form; empty title is a no‑op (matches Flutter `_confirm`). |
| `ContactListScreen` | Alphabetically sorted contact cards, sort toggle. |
| `AddContactScreen` | Name/role/phone/email form; empty name is a no‑op. |
| `MenuScreen` | Five navigation entries (Home, Tasks, Contacts, Options, Sign Out). |
| `OptionsScreen` | Font‑size grid and contrast row with selected‑state highlighting. |

### 3.3 Shared UI primitives — `src/components/ui.tsx`

`PrimaryButton`, `SecondaryButton`, `Field`, and `Card` provide a consistent look
and consistent accessibility metadata. Buttons expose `accessibilityRole="button"`
and, where applicable, `accessibilityState` (selected/expanded), which the screens
and tests rely on.

### 3.4 Utility — `src/utils/formatDueDate.ts`

Port of the Flutter `formatDueDate`: renders `"Today at 9:00 AM"` /
`"Tomorrow at 2:30 PM"`, treating any non‑current calendar day as "Tomorrow".

### 3.5 Navigation — `src/navigation/RootNavigator.tsx`

A minimal screen stack held in `useState` (no native navigation dependency). It
maps each screen's callback props to `push` / `pop` / `replace` / `reset`
operations, reproducing the Flutter `push` / `pushReplacement` /
`pushAndRemoveUntil` flows, including the `taskId` parameter passed to
`TaskDetailScreen`. The navigation graph matches
[`docs/navigation-flow.md`](navigation-flow.md).

**Android hardware back button:** a `BackHandler` listener is registered once on
mount. When the stack has more than one entry it pops and reports the press as
handled; at the root screen it returns `false` so the OS performs its default
action (exit). A `stackRef` mirrors the live stack so the single listener always
reads the current depth.

### 3.6 App entry point — `App.tsx` (modified)

Replaced the default `NewAppScreen` template with the real app shell:

```
SafeAreaProvider → AppStateProvider → SafeAreaView → RootNavigator
```

The state provider is now mounted at the root, so `useAppState()` works app‑wide
and the app launches into the Login screen.

### 3.7 Test support — `src/test-support/renderWithState.tsx`

A render helper that wraps a component in `AppStateProvider` (with optional seed)
for use by component tests. It is deliberately placed outside `__tests__/` so Jest
does not treat it as a test suite. (Listed here for completeness; it is not part of
the shipped application.)

---

## 4. Design decisions and rationale

- **Callback‑prop navigation instead of a router.** Screens declare what should
  happen ("on view task", "on open menu") without knowing how navigation is
  implemented. This isolates them for unit/component testing and let us wire the
  app with zero new dependencies.
- **Separate state layer from `AppState.js`.** The richer, UI‑driving context lives
  alongside the original logic class so the existing unit tests remain valid.
- **In‑memory state.** As before, application state resets on app restart; no
  persistence layer was introduced.
- **TypeScript throughout** to match the project's existing configuration.

---

## 5. Verification

| Check | Result |
| --- | --- |
| Jest (full suite) | 58 tests passing across 13 suites |
| ESLint (`App.tsx`, `src`, `__tests__`) | Clean (0 problems) |
| `tsc --noEmit` | No type errors |
| Metro bundle (`index.js`) | Builds successfully — entry resolves through all 10 screens |

---

## 6. Known limitations / follow‑ups

- The navigator provides no transition animations.
- After sign‑in the stack is reset to `[Home]`, so a hardware back press at Home
  exits the app rather than returning to Login (intentional).
- State is not persisted between launches.
- If richer navigation features are needed later (deep links, gestures, tabs/drawer
  for the MENU pattern), the callback‑prop screens can be adapted to React
  Navigation without rewrites.
