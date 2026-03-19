# Runbook

Last updated: 2026-03-18

## Current State

- Expo SDK: 55
- React Native: 0.83.2
- Localization: Korean for `ko*`, English for all other locales
- Notifications: local scheduled notifications only, no server required
- Android debug build: verified on 2026-03-18
- iOS simulator debug build: verified on 2026-03-18

## What Was Implemented

- UI translation layer with Korean and English
- Native locale configuration for Android and iOS
- Local due-today notifications
- In-app notification status card
- In-app 10-second test notification button

## How To Verify On Device

1. Launch the app on a physical device or simulator/emulator with notification support.
2. Confirm the top area shows notification status.
3. Tap `알림 켜기` or `Enable notifications`.
4. Tap the 10-second test notification button.
5. Background the app and confirm the local notification arrives.
6. Add an alarm and confirm it is saved.
7. Edit the device or app language:
   - Korean device/app language should show Korean
   - non-Korean device/app language should show English
8. Create or refresh an alarm and confirm the next reminder is rescheduled.
9. Add alarms with different start dates and confirm `남은 일수` and list ordering match the scheduled reminder day.

## Build Commands

Android:

```bash
cd android
JAVA_HOME=/Users/yourname/Library/Java/JavaVirtualMachines/temurin-21.0.7/Contents/Home ./gradlew assembleDebug
```

iOS:

```bash
cd ios
pod install
xcodebuild -workspace oopsalarm.xcworkspace -scheme oopsalarm -configuration Debug -destination 'platform=iOS Simulator,name=iPhone 16' build
```

## Android Build Note

This project now builds successfully if the machine has Android SDK and JDK 21 configured.

Required machine setup:

- create `android/local.properties` with a valid `sdk.dir=...`
- use JDK 21 for Gradle builds

```properties
sdk.dir=/Users/yourname/Library/Android/sdk
```

The verified local setup used `JAVA_HOME=/Users/taemin/Library/Java/JavaVirtualMachines/temurin-21.0.7/Contents/Home`.

## iOS Build Note

- `ios/Podfile.lock` and `ios/oopsalarm.xcworkspace` should exist after `pod install`
- current Xcode 16.4 compatibility fixes for `expo-modules-core` and `expo-notifications` are persisted through `patch-package`
- `npm install` automatically reapplies those patches via the `postinstall` script

## Important Files

- App entry: `/Users/taemin/Desktop/project/oops-alarm/App.tsx`
- Home screen: `/Users/taemin/Desktop/project/oops-alarm/screens/HomeScreen.tsx`
- i18n: `/Users/taemin/Desktop/project/oops-alarm/i18n/index.tsx`
- Notifications: `/Users/taemin/Desktop/project/oops-alarm/services/notifications.ts`
- Alarm storage: `/Users/taemin/Desktop/project/oops-alarm/services/alarmStorage.ts`
- Alarm schedule logic: `/Users/taemin/Desktop/project/oops-alarm/services/alarmSchedule.ts`
- Native patch files: `/Users/taemin/Desktop/project/oops-alarm/patches/expo-modules-core+55.0.16.patch`, `/Users/taemin/Desktop/project/oops-alarm/patches/expo-notifications+55.0.13.patch`

## Known Constraint

- Real remote push has not been implemented because the current goal is serverless local notifications.
