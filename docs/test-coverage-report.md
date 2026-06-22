# CareConnect — Test Coverage Report

**Project:** SWEN 661 Group 5 — CareConnect
**Module:** `care_connect_react/CareConnect`
**Date:** 2026-06-20

---

## 1. How this report was generated

```bash
cd care_connect_react/CareConnect
npx jest --coverage \
  --collectCoverageFrom='src/**/*.{ts,tsx}' \
  --collectCoverageFrom='AppState.js'
```

Coverage is collected from the React Native application code: the new `src/` tree
(state, screens, UI, navigation, utilities) and the original `AppState.js` logic
module. The app entry/wiring files (`App.tsx`, `index.js`) and pure type
declarations are excluded — they contain no testable branches and are validated by
the Metro bundle build and `tsc` instead.

The HTML report (when generated) is written to `coverage/lcov-report/index.html`.

---

## 2. Overall coverage

| Metric | Coverage | Covered / Total |
| --- | --- | --- |
| Statements | **91.82 %** | 236 / 257 |
| Branches | **87.50 %** | 98 / 112 |
| Functions | **89.06 %** | 114 / 128 |
| Lines | **91.37 %** | 212 / 232 |

All 13 test suites (58 tests) pass while producing these figures.

---

## 3. Per‑file coverage

```
------------------------------|---------|----------|---------|---------|------------------------------
File                          | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
------------------------------|---------|----------|---------|---------|------------------------------
All files                     |   91.82 |     87.5 |   89.06 |   91.37 |
 CareConnect                  |   97.14 |    71.42 |     100 |   96.77 |
  AppState.js                 |   97.14 |    71.42 |     100 |   96.77 | 20
 src/components               |     100 |      100 |     100 |     100 |
  ui.tsx                      |     100 |      100 |     100 |     100 |
 src/navigation               |   67.85 |    58.82 |   58.06 |   63.04 | 76,82-86,95-104,111-121,...
  RootNavigator.tsx           |   67.85 |    58.82 |   58.06 |   63.04 |
 src/screens                  |   98.97 |      100 |      98 |   98.94 |
  AddContactScreen.tsx        |     100 |      100 |     100 |     100 |
  ContactListScreen.tsx       |     100 |      100 |     100 |     100 |
  ForgotPasswordScreen.tsx    |     100 |      100 |     100 |     100 |
  HomeScreen.tsx              |     100 |      100 |     100 |     100 |
  LoginScreen.tsx             |     100 |      100 |     100 |     100 |
  MenuScreen.tsx              |     100 |      100 |     100 |     100 |
  NewTaskScreen.tsx           |     100 |      100 |     100 |     100 |
  OptionsScreen.tsx           |     100 |      100 |     100 |     100 |
  TaskDetailScreen.tsx        |    90.9 |      100 |      75 |      90 | 68
  TaskListScreen.tsx          |     100 |      100 |     100 |     100 |
 src/state                    |   98.18 |    94.11 |     100 |   97.87 |
  AppState.tsx                |   98.18 |    94.11 |     100 |   97.87 | 274
 src/test-support             |     100 |      100 |     100 |     100 |
  renderWithState.tsx         |     100 |      100 |     100 |     100 |
 src/utils                    |     100 |    77.77 |     100 |     100 |
  formatDueDate.ts            |     100 |    77.77 |     100 |     100 | 11,15
------------------------------|---------|----------|---------|---------|------------------------------
```

---

## 4. Analysis

### Fully covered (100 %)

- **All ten screen components** are at or near 100 %. Eight screens are at 100 %
  across every metric.
- **Shared UI primitives** (`ui.tsx`) and the **state context** (`AppState.tsx`,
  98 %) are effectively fully exercised by the screen tests.

### Partially covered — explained

| File | Gap | Reason |
| --- | --- | --- |
| `src/navigation/RootNavigator.tsx` | 67.85 % stmts / 58.82 % branch | The navigation suite is a **smoke test** that exercises representative flows (login/replace, push/pop, param passing, reset, hardware back). Several individual route arms — e.g. TaskList → NewTask, ContactList → AddContact, the Options route, and several per‑screen MENU pushes — are not all individually driven, so their callback bodies are not counted. |
| `TaskDetailScreen.tsx` | line 68 / 75 % funcs | The screen's **MENU** button callback is not pressed in the TaskDetail tests (the resolve and not‑found paths are). |
| `AppState.js` | line 20 / 71.42 % branch | The original logic module's `buildTheme` only has its **normal‑contrast** branch tested; the non‑normal branch (returns `{}`) is unexercised. This is pre‑existing unit‑test code, unchanged by this work. |
| `src/utils/formatDueDate.ts` | branches 11, 15 / 77.77 % | The 12‑hour wrap edge (the `% 12` mapping to 12) and the **"Tomorrow"** branch are not both exercised; current tests assert the "Today / PM" path via the screens. |
| `src/state/AppState.tsx` | line 274 / 94.11 % branch | The `useAppState()` **guard** that throws when used outside a provider is never triggered (all usage is correctly wrapped). |

None of the gaps represent untested user‑facing behavior that the suite claims to
cover; they are secondary branches and the deliberately representative navigation
smoke test.

---

## 5. Recommendations to raise coverage (optional)

If higher coverage is desired (e.g. a ≥ 90 % branch target):

1. **RootNavigator:** add a parameterized test that walks each remaining route arm
   (TaskList→NewTask, ContactList→AddContact, Home/TaskList/Options MENU pushes,
   Menu→Tasks/Options). This is the single largest lever.
2. **`formatDueDate`:** add direct unit tests for the midnight/noon 12‑hour wrap and
   a future‑dated ("Tomorrow") input.
3. **TaskDetailScreen:** press the MENU button to cover line 68.
4. **`useAppState` guard:** render a consumer without a provider inside
   `expect(() => ...).toThrow()`.
5. **`AppState.js` `buildTheme`:** add an assertion for a non‑normal contrast value.

---

## 6. Conclusion

The component and navigation tests provide **strong coverage of all user‑facing
screens** (screens average ~99 % statements, 100 % branches) and verify the app's
core interactions and navigation end‑to‑end. The remaining uncovered code is
concentrated in the navigation smoke test's unexercised route arms and a few
secondary/defensive branches, all of which are itemized above with clear paths to
close them.
