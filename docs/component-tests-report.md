# CareConnect — React Native Testing Library Component Tests Report

**Project:** SWEN 661 Group 5 — CareConnect
**Module:** `care_connect_react/CareConnect`
**Date:** 2026-06-20

---

## 1. Summary

This report documents the **component tests** added for the React Native version
of CareConnect using **React Native Testing Library (RNTL)**. These complement the
existing logic‑level unit tests (`__tests__/jest_unit.test.js`,
`__tests__/mock_jest_unit.test.js`) by rendering real components, simulating user
interaction, and asserting on the rendered output and resulting state.

| Category | Suites | Tests |
| --- | --- | --- |
| Screen component tests | 10 | 41 |
| Navigation integration tests | 1 | 8 |
| **New tests (this work)** | **11** | **49** |
| Pre‑existing unit tests | 2 | 9 |
| **Total** | **13** | **58** |

All 58 tests pass.

---

## 2. Tooling and environment

| Tool | Version / setting |
| --- | --- |
| Test runner | Jest 29 (`preset: @react-native/jest-preset`) |
| Component testing | `@testing-library/react-native` **v14** |
| Renderer | `test-renderer` 1.x (RNTL 14's engine) |
| React / React Native | 19.x / 0.86 |
| Language | TypeScript (`.tsx` test files) |

### Important: RNTL v14 is asynchronous

In RNTL **v14**, `render()` and the `fireEvent` helpers (`fireEvent.press`,
`fireEvent.changeText`) are **async and must be awaited**. Calling `render()`
without `await` returns a pending Promise and the query helpers / `screen` never
bind. Every test in this suite therefore uses `await render(...)` and
`await fireEvent...(...)`.

### Query strategy

To stay robust across versions, tests rely on built‑in queries plus standard Jest
matchers rather than the deprecated `@testing-library/jest-native` matchers:

- `getByText` / `getAllByText`, `getByPlaceholderText`, `getByTestId`
- `queryBy*` + `toBeNull()` for absence
- element `props` (e.g. `secureTextEntry`, `accessibilityState.selected`) for
  state assertions
- `jest.fn()` callback spies for navigation assertions

### Shared helper

`src/test-support/renderWithState.tsx` wraps a component in `AppStateProvider`
(with an optional `seed`) so screens that call `useAppState()` can be rendered in
isolation with deterministic data.

---

## 3. Running the tests

```bash
cd care_connect_react/CareConnect
npm install        # first time only
npm test           # runs the full Jest suite

# subsets
npx jest __tests__/components     # screen component tests
npx jest __tests__/navigation     # navigation integration tests
```

---

## 4. Test inventory

### 4.1 Screen component tests (`__tests__/components/`)

| Suite | Tests | What it verifies |
| --- | --- | --- |
| `LoginScreen.test.tsx` | 5 | Form renders; sign‑in blocked when fields empty; sign‑in fires when both filled; SHOW/HIDE toggles `secureTextEntry`; forgot‑password callback. |
| `ForgotPasswordScreen.test.tsx` | 3 | Reset form renders; confirmation replaces form after send; back‑to‑login callback. |
| `HomeScreen.test.tsx` | 4 | Next/Next‑Up cards from seeded state; empty state; `onViewTask` receives the next task id; View‑All and MENU callbacks. |
| `TaskListScreen.test.tsx` | 5 | Active list + count; completed section hidden until toggled; opening a task by id; sort‑direction toggle; add/menu callbacks. |
| `TaskDetailScreen.test.tsx` | 5 | Details + caregiver card render; caregiver card omitted when absent; mark‑resolved fires callback and hides the button; resolve hidden for completed tasks; not‑found guard. |
| `NewTaskScreen.test.tsx` | 4 | Fields render; empty title is a no‑op; confirming adds the task to shared state (observed via a co‑rendered list) and fires callback; discard/menu callbacks. |
| `ContactListScreen.test.tsx` | 4 | Contacts render with details; default alphabetical order; sort toggle; add/menu callbacks. |
| `AddContactScreen.test.tsx` | 4 | Fields render; empty name is a no‑op; confirming adds the contact to shared state and fires callback; discard/menu callbacks. |
| `MenuScreen.test.tsx` | 2 | All entries render; each button routes to its callback. |
| `OptionsScreen.test.tsx` | 5 | Options render; default selections (Medium / Normal); selecting a font size updates selection; selecting a contrast updates selection; menu callback. |

**Subtotal: 41 tests.**

### 4.2 Navigation integration tests (`__tests__/navigation/RootNavigator.test.tsx`)

These render the full `RootNavigator` and drive it through real user actions,
exercising the stack operations end‑to‑end.

| Test | Stack operation exercised |
| --- | --- |
| Starts on the Login screen | initial route |
| Replaces Login with Home after signing in | `replace` |
| Pushes and pops the forgot‑password screen | `push` / `pop` |
| Navigates Home → Menu → Contacts | `push` + `replace` |
| Opens a task from Home and pops back after resolving | `push` + param passing + state mutation + `pop` |
| Resets to Login when signing out from the Menu | `reset` |
| Hardware back: pops the stack and reports the press as handled | `BackHandler` returns `true` |
| Hardware back: unhandled at the root so the OS can exit | `BackHandler` returns `false` |

**Subtotal: 8 tests.**

The hardware back‑button tests spy on `BackHandler.addEventListener` to capture the
registered handler and invoke it as the OS would, asserting both the resulting
screen and the boolean returned to the OS.

---

## 5. Testing patterns used

- **Render in isolation with injected state.** Screens are rendered via
  `renderWithState(<Screen/>, { seed })` so assertions don't depend on the live
  clock or default data.
- **Behavioral assertions, not snapshots.** Tests assert on visible text, element
  props, and callback invocations — resilient to styling changes.
- **Shared‑state observation.** For "add" flows, the form and a list are rendered
  under one provider so the test can confirm the new item actually lands in state.
- **Callback spies for navigation.** Screens take navigation callbacks; tests pass
  `jest.fn()` and assert call count / arguments (e.g. the task id).
- **Accessibility‑aware selection.** Toggle/selection state is asserted through
  `accessibilityState`, which doubles as a screen‑reader contract.

---

## 6. Results

```
Test Suites: 13 passed, 13 total
Tests:       58 passed, 58 total
Snapshots:   0 total
```

See [`docs/test-coverage-report.md`](test-coverage-report.md) for coverage detail.
