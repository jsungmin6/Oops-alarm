# Phase 3: Notifications

Last updated: 2026-03-18

## Objective

Notify users when they have an alarm that is due today.

## Requirement Interpretation

The requested behavior is:

- when the due date arrives
- tell the user there is something to do today

Given the current product architecture, the best first implementation is local scheduled notifications. Remote push can be added later if business requirements expand.

## Recommended Delivery Strategy

### Phase 3A. Local notifications first

Implement on-device scheduling using `expo-notifications`.

Why:

- No backend exists today.
- The app data already lives entirely on-device.
- The reminder can be derived from local alarm state.
- This satisfies the user-facing requirement fastest.

### Phase 3B. Remote push second, only if needed

Add Expo Push Service or direct FCM/APNs only if one of these becomes necessary:

- multi-device reminders
- server-triggered campaigns
- reminders even when app data moves to backend ownership
- analytics / delivery receipts / segmentation

## Work Items

1. Add `expo-notifications`.
2. Add permission request flow.
3. Add Android notification channel setup.
4. Build a scheduler that recalculates due dates whenever alarms are added, edited, refreshed, or deleted.
5. Cancel obsolete scheduled notifications when alarm data changes.
6. Localize notification title/body using the Phase 2 translation layer.
7. Test on real devices.

## Notification Design

### Trigger model

Per alarm:

- compute the next due date from `createdAt + interval`
- schedule a notification for the start of the due day or a product-defined reminder time

Recommended reminder time for v1:

- 09:00 local device time

Reason:

- avoids midnight delivery
- more user-friendly
- easier to understand than exact timestamp matching

### Copy examples

Korean:

- title: `오늘 해야 할 일이 있어요`
- body: `{alarmName} 확인할 시간이에요`

English:

- title: `You have something to do today`
- body: `It is time to check ${alarmName}`

## Scheduling Rules

- Add alarm => schedule next reminder
- Edit alarm => cancel old reminder and reschedule
- Refresh alarm => cancel old reminder and schedule from the new base date
- Delete alarm => cancel related reminder
- App launch / foreground => reconcile scheduled notifications against local data

## Remote Push Expansion Plan

If remote push is later required:

1. Add token registration with `getExpoPushTokenAsync`.
2. Store push tokens in a backend.
3. Add a server job that computes due alarms daily.
4. Send through Expo Push Service first.
5. Move to direct FCM/APNs only if Expo Push becomes limiting.

## Acceptance Criteria

- Permission flow works on Android and iOS.
- Due-today reminders are delivered on physical devices.
- Notification text is localized.
- Editing or deleting alarms does not leave stale scheduled notifications behind.
- App tap from notification opens the app cleanly.

## Test Matrix

- Android physical device
- iPhone physical device
- app foreground
- app background
- app terminated
- permission denied path
- alarm edited after scheduling
- alarm refreshed after scheduling

## Risks

- Testing remote push is impossible in Expo Go on Android for SDK 53+ and should be assumed to require development or release builds
- exact scheduling behavior differs by platform
- stale notifications if schedule reconciliation is not centralized

## Deliverables

- Notification service module
- Scheduler/reconciliation module
- Permission UI flow
- Android channel config
- Notification QA checklist

## Source Notes

- Expo notifications reference: https://docs.expo.dev/versions/latest/sdk/notifications/
- Expo push setup: https://docs.expo.dev/push-notifications/push-notifications-setup
- Expo notification behavior guide: https://docs.expo.dev/push-notifications/what-you-need-to-know/
- Expo Push Service guide: https://docs.expo.dev/push-notifications/sending-notifications/
