# SWEN661-Group-5

This is the Group 5 project for May 2026 SWEN661.

## Project Name and Description

This application is called **CareConnect**, a task manager designed for care recipients with Parkinson's disease. Group 5's focus is UI/UX customization for users with Parkinsonian tremors (a "pill-rolling" tremor of the thumb and index finger): large touch targets, confirmation steps before important or destructive actions, adjustable font sizes and contrast modes, and full screen-reader/keyboard support.

**Prototype note:** all data is in-memory dummy seed data, and sign-in intentionally accepts any non-empty email/password. There is no backend.

## Group Members

- Donielle Kinchen
- Prashanth Saseenthar
- Jonathan Baretto
- Aaron Kliewer

## Link to team charter

[Team Charter](https://swen661team5.slack.com/files/U0B4K57NJ3X/F0B51V71LGL/swen_661_team_5_charter.docx)

## Repository layout

This repository contains four implementations of the CareConnect prototype:

| Folder | Stack | Target platform |
|---|---|---|
| `care_connect_app` | Flutter | Mobile — iOS focus (also runs on Android) |
| `care_connect_react/CareConnect` | React Native | Mobile — Android focus |
| `desktop` | Electron + React + Vite | Desktop — macOS focus |
| `care_connect_web` | React + React Router + Vite | Web (PWA, deployed to Vercel) |

All implementations share the same screens (Login, Forgot Password, Home, Task List, Task Detail, New Task, Contacts, Add Contact, Menu, Options), the same seed data, and the same behavioral rules (due-date formatting, task status badges, confirmation dialogs, validation messages). See `docs/navigation-flow.md` for the shared navigation flow.

## Prerequisites

Install the following depending on which app you are running:

- macOS with Xcode installed from the App Store (mobile + desktop)
- Xcode Command Line Tools selected in `Xcode > Settings > Locations > Command Line Tools`
- Android Studio with Android SDK, Android Emulator, and at least one Android Virtual Device (mobile)
- Flutter SDK available on your `PATH` (Flutter app)
- Node.js `>= 22.11.0` (React Native, desktop, and web apps)
- CocoaPods for iOS native dependencies (React Native app)

Verify the main tools:

```bash
flutter doctor
node --version
npm --version
xcodebuild -version
adb version
```

## Flutter app (`care_connect_app`): local development

```bash
cd care_connect_app
flutter pub get      # install dependencies
flutter devices      # list available devices
flutter run          # run on the open simulator/emulator
flutter analyze lib  # static analysis
flutter test         # run the test suite
```

Build commands:

```bash
flutter build apk --debug        # Android debug APK
flutter build ios --simulator    # iOS Simulator build
```

To run on a specific device: `flutter run -d <device-id>`. For iOS, open the Simulator first with `open -a Simulator`.

## React Native app (`care_connect_react/CareConnect`): local development

```bash
cd care_connect_react/CareConnect
npm install          # JavaScript dependencies
bundle install       # Ruby deps for CocoaPods
(cd ios && bundle exec pod install)   # iOS native dependencies

npm start            # start Metro
npm run android      # run on Android emulator (second terminal)
npm run ios          # run on iOS Simulator (second terminal)

npx tsc --noEmit     # TypeScript validation
npm run lint         # lint
npm test -- --runInBand --no-watchman   # Jest tests
```

Android debug APK: `cd android && ./gradlew assembleDebug`. To use Xcode directly: `open ios/CareConnect.xcworkspace` and run the `CareConnect` scheme.

## Desktop app (`desktop`): local development

```bash
cd desktop
npm install
npm run dev          # Vite dev server + Electron window with live reload
npm start            # production build + Electron
npm test             # Vitest suite
npm run pack         # package a macOS .app into dist-electron/
```

The desktop app has a native macOS menu with keyboard shortcuts (New Task Cmd+N, Save Cmd+S, Search Cmd+F, Mark Resolved Cmd+R, Go Home Cmd+Shift+H, Tasks Cmd+T, Contacts Cmd+L, Settings Cmd+comma, Sign Out Cmd+Shift+Q). No shortcut needs more than two modifier keys, per the tremor-focused design constraints. Note that Go Home is Cmd+**Shift**+H because plain Cmd+H is reserved by macOS for hiding the app.

## Web app (`care_connect_web`): local development

```bash
cd care_connect_web
npm run dev          # Vite dev server
npm run build        # type-check + production build
npm run preview      # serve the production build
npm test             # Vitest suite
npm run test:e2e     # Playwright end-to-end tests
npm run lint         # eslint
```

The web app is a PWA and is deployed to Vercel. Signed-out visitors are redirected to the login screen; sign-in state is in-memory only, so a hard refresh returns to the login screen (prototype behavior).

## Accessibility testing

The Options screen in every implementation provides four font sizes (Small/Medium/Large/XL) and three contrast modes (Normal/High/XHigh). Status meaning is always conveyed by icon + text as well as color (WCAG 1.4.1), and important/destructive actions (mark resolved, discard a dirty form, sign out) always ask for confirmation.

### Android emulator setup for TalkBack audio

For screen-reader testing, the Android emulator must route audio through the host Mac speakers. If TalkBack is enabled but no speech is heard, check the emulator audio configuration.

1. Create or select an Android Virtual Device in Android Studio:

   `Android Studio > Device Manager`

2. Shut down the emulator before editing its configuration.

3. List available emulator names:

   ```bash
   emulator -list-avds
   ```

4. Open the Android Virtual Device configuration folder:

   ```bash
   open ~/.android/avd
   ```

5. Open the selected emulator folder, then edit `config.ini`. Confirm these settings are present:

   ```ini
   hw.audioInput = yes
   hw.audioOutput = yes
   ```

6. Start the emulator normally from Android Studio Device Manager. Do not launch it with `-no-audio`.

7. If audio still does not play, cold boot the emulator from Device Manager:

   `Device Manager > selected device > dropdown menu > Cold Boot Now`

8. Enable TalkBack inside the emulator:

   `Settings > Accessibility > TalkBack > Use TalkBack`

Recommended for screenshots:

```text
Settings > Accessibility > TalkBack > Settings > Advanced settings > Developer settings > Display speech output
```

TalkBack gestures to verify labels:

- Swipe right: next accessible element
- Swipe left: previous accessible element
- Double tap: activate the focused element
- Drag over the screen: explore by touch

### iOS Simulator setup for VoiceOver audio

For VoiceOver testing, use Xcode's Simulator/developer tooling rather than a detached or headless simulator session. VoiceOver speech output is most reliable when the Simulator is opened from Xcode and the app is run in that Simulator.

1. Open Xcode at least once and accept any required license or component installation prompts.

2. Confirm Command Line Tools are selected:

   `Xcode > Settings > Locations > Command Line Tools`

3. Open the Simulator from Xcode:

   `Xcode > Open Developer Tool > Simulator`

4. Boot the target iPhone simulator.

5. Enable VoiceOver inside the simulated iPhone:

   `Settings > Accessibility > VoiceOver > VoiceOver`

6. Confirm the Mac's audio output and volume are enabled. VoiceOver output should play through the host Mac speakers.

7. If VoiceOver does not produce audible output, run the app from Xcode/Simulator again and verify the simulator's developer/accessibility options are active.

Recommended for screenshots:

```text
Settings > Accessibility > VoiceOver > Caption Panel
```

VoiceOver gestures to verify labels:

- Swipe right: next accessible element
- Swipe left: previous accessible element
- Double tap: activate the focused element
- Drag over the screen: explore by touch

### Screen-reader testing checklist

Use the same checklist for every implementation. Verify that TalkBack/VoiceOver (mobile) or the platform screen reader (desktop/web) announce clear labels, roles, and hints for:

- Login email field
- Login password field
- Show/hide password button
- Forgot password button
- Sign in button
- Home/dashboard heading
- Task cards (title, due time, and status)
- View task buttons
- Sort buttons
- Completed task expand/collapse control
- New task form fields
- Add contact form fields
- Confirm/cancel actions (including confirmation dialogs)
- Menu button
- Menu navigation actions
- Accessibility preference options (font size and contrast)

Capture screenshots showing the screen reader focused on key controls so the submitted document demonstrates that labels are announced correctly.
