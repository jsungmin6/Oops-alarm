# Oops Alarm Execution Plan

Last updated: 2026-03-18

## Goal

This plan covers the three requested changes:

1. Fix multilingual behavior so Korean users see Korean and non-Korean users see English.
2. Upgrade the app from the 2025 stack to the current Expo baseline.
3. Send notifications to users when they have work due today.

## Current Baseline

- App type: Expo + React Native single-screen app
- Current app stack from `package.json`:
  - `expo ~53.0.20`
  - `react-native 0.79.5`
  - `react 19.0.0`
- Current storage model: local `AsyncStorage`
- Current notification capability: none
- Current i18n capability: none

## Verified Latest Baseline

Verified on 2026-03-18 using official Expo docs:

- Expo SDK 55 released on 2026-02-25
- Expo SDK 55 includes:
  - React Native 0.83
  - React 19.2

Important platform note:

- Expo SDK 55 drops Legacy Architecture support.
- This repository currently has `"newArchEnabled": false` in `app.json`.
- Moving to SDK 55 therefore requires validating New Architecture compatibility.

## Delivery Order

The safest order is:

1. Phase 1: Upgrade foundation
2. Phase 2: Localization and multilingual behavior
3. Phase 3: Notifications

This order is intentional. Notifications require native configuration and build validation, which should be done on the upgraded baseline rather than on the older SDK 53 stack.

## Phase Files

- [PHASE-1-upgrade-foundation.md](/Users/taemin/Desktop/project/oops-alarm/docs/plan/PHASE-1-upgrade-foundation.md)
- [PHASE-2-localization.md](/Users/taemin/Desktop/project/oops-alarm/docs/plan/PHASE-2-localization.md)
- [PHASE-3-push-notifications.md](/Users/taemin/Desktop/project/oops-alarm/docs/plan/PHASE-3-push-notifications.md)

## Scope Boundaries

In scope:

- App UI language switching based on device/app locale
- Native supported locale configuration
- Expo SDK and dependency upgrade
- Due-today notifications for alarms
- Notification permission flow
- Local notification scheduling
- Optional remote push design for future server delivery

Out of scope for the first pass unless explicitly added:

- Admin dashboard
- Full backend job scheduler
- User accounts
- Cloud sync of alarms across devices
- Rich segmented locale packs beyond Korean/English

## Product Decisions

### Language behavior

- Supported languages in first pass: `ko`, `en`
- Resolution rule:
  - If device/app language starts with `ko`, show Korean
  - Otherwise show English
- Per-app language settings should be supported through native locale declarations where available.

### Notification behavior

- Primary requirement interpretation:
  - When an alarm becomes due today, notify the user that there is something to do today.
- Recommended first implementation:
  - Local scheduled notifications generated on-device from saved alarms
- Recommended second implementation:
  - Optional remote push later, only if cross-device or server-driven delivery is required

Why local first:

- Current app is fully local and has no backend.
- The requested due-date reminder can be satisfied without introducing a server.
- It is faster, cheaper, and lower risk than building a remote push pipeline first.

## Key Risks

### SDK upgrade risk

- SDK 55 requires New Architecture validation.
- Some dependencies may need version replacement or removal.
- `react-native-google-mobile-ads` must be revalidated even if currently unused.

### Localization risk

- The repository currently hardcodes Korean UI strings.
- If Korean users are seeing English in production, the issue may be outside the React text layer:
  - native app metadata
  - permission dialog strings
  - notification text
  - store assets / release build configuration

### Notification risk

- Push notifications do not work in Expo Go on Android from SDK 53+.
- Development builds or release builds are required for real push validation.
- Real remote push requires device testing plus credentials for FCM and APNs.

## Success Criteria

- Korean users see Korean UI and notification copy.
- Non-Korean users see English UI and notification copy.
- App runs on the current Expo baseline with no major runtime regressions.
- Due-today reminders are delivered reliably on supported devices.

## Source Notes

Official references used to shape this plan:

- Expo SDK 55 changelog: https://expo.dev/changelog/sdk-55
- Expo SDK upgrade walkthrough: https://docs.expo.dev/workflow/upgrading-expo-sdk-walkthrough
- Expo localization guide: https://docs.expo.dev/guides/localization/
- Expo notifications reference: https://docs.expo.dev/versions/latest/sdk/notifications/
- Expo push setup guide: https://docs.expo.dev/push-notifications/push-notifications-setup
- Expo notification concepts: https://docs.expo.dev/push-notifications/what-you-need-to-know/
