# Phase 1: Upgrade Foundation

Last updated: 2026-03-18

## Objective

Move the app from Expo SDK 53 to the current supported baseline and make the project safe for subsequent localization and notification work.

## Why This Phase Comes First

- The app is currently on an old Expo stack from 2025.
- Notification work touches native configuration and should not be implemented on an outdated SDK.
- Expo SDK 55 is the current latest verified baseline as of 2026-03-18.

## Current vs Target

Current:

- `expo ~53.0.20`
- `react-native 0.79.5`
- `react 19.0.0`
- `newArchEnabled: false`

Target:

- Expo SDK 55
- React Native 0.83
- React 19.2
- New Architecture compatible build

## Work Items

1. Audit dependency compatibility against Expo SDK 55.
2. Upgrade incrementally rather than jumping blind.
3. Remove or replace dependencies that block New Architecture.
4. Regenerate native projects cleanly if needed after config changes.
5. Run typecheck and platform smoke tests on Android and iOS.

## Recommended Execution

### Step 1. Dependency audit

Check these packages first:

- `@react-navigation/native`
- `@react-navigation/native-stack`
- `react-native-gesture-handler`
- `react-native-safe-area-context`
- `react-native-screens`
- `@react-native-community/datetimepicker`
- `@react-native-async-storage/async-storage`
- `react-native-progress`
- `react-native-google-mobile-ads`

Special note:

- `react-native-google-mobile-ads` is present but not currently used in the code paths inspected.
- If it is truly unused, remove it before upgrade to reduce native risk.

### Step 2. Upgrade path

Recommended route:

1. Create a clean branch for upgrade work.
2. Upgrade Expo dependencies using Expo-managed version resolution.
3. Validate the project on SDK 54 if required to isolate breakage.
4. Upgrade to SDK 55.
5. Run Expo doctor and fix duplicate/native module issues.

### Step 3. New Architecture validation

Because SDK 55 no longer supports Legacy Architecture:

- remove the assumption that `"newArchEnabled": false` is acceptable
- validate every native package under New Architecture
- prioritize replacing fragile native dependencies over patching around them

### Step 4. Native smoke tests

Validate:

- app boot
- font loading
- navigation
- `AsyncStorage` read/write
- date picker
- gesture/swipe row

## Acceptance Criteria

- Project installs cleanly on the SDK 55 dependency set.
- Android and iOS builds start successfully.
- No hard blocker remains for New Architecture.
- `npx tsc --noEmit` passes.
- Core alarm CRUD still works.

## Risks

- Native dependency breakage during SDK 55 migration
- New Architecture incompatibility
- Config drift between checked-in native folders and Expo config

## Deliverables

- Updated `package.json`
- Updated `app.json`
- Any required native config changes
- Upgrade notes in a changelog or migration memo

## Exit Gate

Do not start Phase 2 or Phase 3 until:

- app boots on the upgraded stack
- no unresolved native dependency blocker remains

## Source Notes

- Expo SDK 55 changelog: https://expo.dev/changelog/sdk-55
- Expo SDK 54 changelog: https://expo.dev/changelog/sdk-54
- Expo upgrade walkthrough: https://docs.expo.dev/workflow/upgrading-expo-sdk-walkthrough
