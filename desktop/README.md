# CareConnect Desktop (Electron)

An accessible desktop companion to the CareConnect mobile apps, built for the
**Week 7** assignment (SWEN 661 Group 5). It carries the same data model and
screens as the React Native / Flutter versions, re-implemented as an Electron
application that targets **WCAG 2.1 Level AA** with keyboard-first interaction
for the assigned scenario: **care recipients with Parkinsonian tremor**.

The visual language follows the Week 8 clinical-dashboard style guide (navy
`#15365B` chrome, off-white `#F9FAFB` surfaces, Verdana type scale, 80px table
rows, `radius-sm`/`radius-md`, and Active / High-Priority / Follow-up status
badges) defined as CSS tokens in `src/index.css`. The focus ring is the
accessible teal `#0C7585` at **3px** with a 2px offset, applied to `:focus` so
it is never suppressed.

## Tech stack

- **Electron** — desktop shell (`electron/main.cjs`, `electron/preload.cjs`)
- **React + TypeScript** renderer, bundled by **Vite**
- **Vitest + Testing Library** for accessible-by-role component tests

## Getting started

```bash
cd desktop
npm install        # downloads Electron on first run
npm start          # builds the renderer and launches the desktop app
```

Other scripts:

| Script          | What it does                                                |
| --------------- | ----------------------------------------------------------- |
| `npm run dev`   | Vite dev server + Electron with hot reload                  |
| `npm run build` | Type-safe production build of the renderer into `dist/`     |
| `npm start`     | `build` then launch Electron against the built files        |
| `npm test`      | Run the Vitest accessibility/behaviour suite                |

> If `npm install` runs in a locked-down environment that blocks post-install
> scripts, run `node node_modules/electron/install.js` once to fetch the
> Electron binary before `npm start`.

## Screens

Login · Forgot Password · Home · Task List · Task Detail · New Task ·
Contact List · Add Contact · Options · Menu — mirroring the mobile apps and the
focus orders documented in §2 of the Accessibility Notes.

## How the accessibility requirements are met

The design brief (`CareConnect Desktop — Accessibility Notes`) drove every
decision. Highlights, by section:

### §2 Focus order & management

- Every authenticated screen shares the same top-of-page order: **skip link →
  menu bar → toolbar → main content** (`AppChrome.tsx`).
- After navigation, focus moves to the new screen's `<h1>` (`AppRouter.tsx`
  focus effect; each heading is `tabIndex=-1`).
- Modal dialogs trap focus and restore it to the triggering element on close;
  **Esc** cancels (`Dialog.tsx`).

### §3 Focus indicators

- Global `:focus` outline: **3px solid teal `#0C7585`, 2px offset**, applied to
  `:focus` (not only `:focus-visible`) so it is **never suppressed** regardless
  of input method (`index.css`).
- Component-specific treatments: menu-bar items get a teal bottom border +
  highlight; text inputs swap to a teal border; toggle/option buttons announce
  `aria-pressed` / `aria-selected`.

### §4 Keyboard shortcuts

Implemented as a **native Electron menu** (File ▸ Edit ▸ View ▸ Help) whose
accelerators forward to the renderer over a secure IPC bridge, so there is a
single source of truth for actions (`electron/main.cjs` → `preload.cjs` →
`AppRouter.tsx`). `CmdOrCtrl` maps Ctrl→Cmd on macOS automatically.

| Action            | Shortcut          |
| ----------------- | ----------------- |
| New Task          | Ctrl/Cmd + N      |
| Save / Confirm    | Ctrl/Cmd + S      |
| Search            | Ctrl/Cmd + F      |
| Open Settings     | Ctrl/Cmd + ,      |
| Mark Resolved     | Ctrl/Cmd + R      |
| Go to Home        | Ctrl/Cmd + H      |
| Go to Task List   | Ctrl/Cmd + T      |
| Go to Contacts    | Ctrl/Cmd + L      |
| Toggle sort order | Ctrl/Cmd + ↑ / ↓  |
| Sign out          | Ctrl/Cmd + Shift+Q|
| Help              | F1                |
| Close dialog      | Esc               |

Every shortcut is **also reachable by Tab + Enter** through the in-window menu
bar and toolbar (§6 sticky-key compatibility) — no shortcut requires more than
two modifier keys. (In a plain browser, e.g. `vitest`/`vite dev` without the
Electron shell, an equivalent keyboard layer takes over.)

### §5 WCAG 2.1 AA mapping

- **1.1.1 / 2.5.3** — toolbar glyphs are `aria-hidden`; every control has a text
  label matching its accessible name.
- **1.3.1 / 2.4.6** — one `<h1>` per screen, `<h2>` sections, real lists, and
  `<label htmlFor>`-associated inputs.
- **1.4.1** — completed tasks use strikethrough **and** a "Completed" badge with
  a ✓, never colour/opacity alone.
- **1.4.3 / 1.4.11** — style-guide palette: body `#111827` on `#F9FAFB` (~16:1),
  secondary `#6B7280` (~4.6:1); thick input borders `#374151` and the teal focus
  ring hold ≥3:1 against adjacent surfaces.
- **1.4.4 / 1.4.10 / 1.4.12** — Options screen scales font Small→XL via the
  `--font-scale` root variable; single-column layout reflows under ~320px CSS;
  line-height 1.5 throughout.
- **2.1.1 / 2.1.2** — fully keyboard operable; focus only trapped inside dialogs.
- **2.4.1** — skip-to-main-content link is the first focusable element.
- **2.5.8** — interactive targets are ≥44×44px; primary buttons are full-width.
- **3.2.2 / 3.2.3** — inputs never auto-submit; menu bar & toolbar are identical
  and fixed on every screen.
- **3.3.1 / 3.3.2 / 3.3.4** — required fields marked with `*` + `aria-required`;
  errors use `role="alert"` / `aria-describedby`; destructive actions (Sign Out,
  Mark Resolved, Discard) require a confirmation dialog.
- **4.1.2 / 4.1.3** — `aria-pressed`, `aria-selected`, `aria-expanded` expose
  control state; status messages use `role="status"` / `aria-live`.

### §6 Tremor-specific accommodations

No time limits or auto-dismissing dialogs; large full-width targets; sticky-key
compatible shortcuts; no hover-only content; confirmation on destructive
actions; no drag-and-drop.

## Tests

`npm test` runs Testing-Library suites that assert behaviour through
accessibility roles/state (password toggle `aria-pressed`, sort `aria-pressed`,
completed `aria-expanded`, option `aria-selected`, dialog focus trap + Esc, focus
moving to the heading after navigation, and confirm-before-sign-out).

## AI usage statement

AI tools assisted with implementation and test authoring. All generated code,
components, and tests were reviewed, verified, and understood before inclusion.
