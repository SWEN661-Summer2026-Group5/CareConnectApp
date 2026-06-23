# SWEN661-Group-5

This is the Group 5 project for May 2026 SWEN661

## Project Name and Description

This application is called CareConnect and its primary function is that of a task manager application specifically designed for patients with short term memory loss. Group 5's focus will be additionaly UI/UX customization of the CareConnect app for care recipients with Parkinsonian tremors (a "pill-rolling" tremor of the thumb and index finger).

## Group Members

- Donielle Kinchen
- Prashanth Saseenthar
- Jonathan Baretto
- Aaron Kliewer

## Link to team charter

[Team Charter](https://swen661team5.slack.com/files/U0B4K57NJ3X/F0B51V71LGL/swen_661_team_5_charter.docx)

## Setup instructions

This repository contains two implementations of the CareConnect mobile app:

- Flutter app: `care_connect_app`
- React Native app: `care_connect_react/CareConnect`

The instructions below cover local development, emulator setup, screen-reader testing, and common build/test commands for both apps.

## Prerequisites

Install the following before running either app:

- macOS with Xcode installed from the App Store
- Xcode Command Line Tools selected in `Xcode > Settings > Locations > Command Line Tools`
- Android Studio with Android SDK, Android Emulator, and at least one Android Virtual Device
- Flutter SDK available on your `PATH`
- Node.js `>= 22.11.0` for the React Native app
- CocoaPods for iOS native dependencies

Verify the main tools:

```bash
flutter doctor
node --version
npm --version
xcodebuild -version
adb version
```

## Android emulator setup for TalkBack audio

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

## iOS Simulator setup for VoiceOver audio

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

7. If VoiceOver does not produce audible output, run the app from Xcode/Simulator again and verify the simulator's developer/accessibility options are active. For manual evidence, the iOS Simulator plus Xcode developer tools should be used so VoiceOver announcements can be heard during testing.

Recommended for screenshots:

```text
Settings > Accessibility > VoiceOver > Caption Panel
```

VoiceOver gestures to verify labels:

- Swipe right: next accessible element
- Swipe left: previous accessible element
- Double tap: activate the focused element
- Drag over the screen: explore by touch

## Flutter app: local development

App path:

```bash
cd care_connect_app
```

Install dependencies:

```bash
flutter pub get
```

List available devices:

```bash
flutter devices
```

Run on Android emulator:

```bash
flutter run -d <android-device-id>
```

Run on iOS Simulator:

```bash
open -a Simulator
flutter run -d <ios-device-id>
```

If only one simulator/emulator is running, this is usually enough:

```bash
flutter run
```

Analyze app source:

```bash
flutter analyze lib
```

Run Flutter tests:

```bash
flutter test
```

Build Android debug APK:

```bash
flutter build apk --debug
```

Build for iOS Simulator:

```bash
flutter build ios --simulator
```

## React Native app: local development

App path:

```bash
cd care_connect_react/CareConnect
```

Install JavaScript dependencies:

```bash
npm install
```

Install iOS native dependencies:

```bash
bundle install
cd ios
bundle exec pod install
cd ..
```

Start Metro:

```bash
npm start
```

Run on Android emulator from a second terminal:

```bash
npm run android
```

Run on iOS Simulator from a second terminal:

```bash
npm run ios
```

Run TypeScript validation:

```bash
npx tsc --noEmit
```

Run lint:

```bash
npm run lint
```

Run React Native tests:

```bash
npm test -- --runInBand --no-watchman
```

Build Android debug APK:

```bash
cd android
./gradlew assembleDebug
cd ..
```

Open the iOS project in Xcode:

```bash
open ios/CareConnect.xcworkspace
```

From Xcode, select an iPhone simulator and run the `CareConnect` scheme.

## Screen-reader testing checklist

Use the same checklist for the Flutter and React Native versions.

Verify that TalkBack and VoiceOver announce clear labels, roles, and hints for:

- Login email field
- Login password field
- Show/hide password button
- Forgot password button
- Sign in button
- Home/dashboard heading
- Task cards
- View task buttons
- Sort buttons
- Completed task expand/collapse control
- New task form fields
- Add contact form fields
- Confirm/cancel actions
- Menu button
- Menu navigation actions
- Accessibility preference options

Capture screenshots showing TalkBack or VoiceOver focused on key controls so the submitted Word document demonstrates that labels are announced correctly.
