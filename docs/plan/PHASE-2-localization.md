# Phase 2: Localization

Last updated: 2026-03-18

## Objective

Ensure Korean users see Korean and other users see English across UI, notifications, and relevant native-facing text.

## Root Cause in Current Project

The current repository has no localization system.

- UI strings are hardcoded directly in components.
- There is no locale detection layer.
- There is no translation dictionary.
- There is no native supported locale declaration.

Because of that, multilingual behavior is undefined. If Korean users are seeing English in the shipped app, the problem is likely a combination of:

- missing locale detection
- untranslated default copy
- native metadata or notification copy falling back to English

## Language Rule

Phase 2 will implement this rule:

- `ko*` locale => Korean
- everything else => English

Examples:

- `ko`, `ko-KR` => Korean
- `en`, `en-US`, `ja-JP`, `fr-FR` => English

## Work Items

1. Add locale detection using `expo-localization`.
2. Add a translation layer using `i18n-js` or equivalent lightweight library.
3. Replace all hardcoded UI strings with translation keys.
4. Add supported locale declarations in app config for Android and iOS.
5. Ensure notification titles and bodies are also localized.
6. Re-check locale on Android app foreground because locale can change while app is running.

## Recommended Technical Shape

### Files to introduce

- `src/i18n/index.ts` or equivalent shared location
- `src/i18n/translations/ko.ts`
- `src/i18n/translations/en.ts`

### Strings to migrate first

- screen title
- add/edit modal labels
- validation messages
- alarm row labels
- due-state text
- notification title/body

### Native config

Add supported locales through the Expo localization config plugin so the OS can expose app-language controls where supported.

## Acceptance Criteria

- A Korean device/app language shows Korean UI.
- A non-Korean device/app language shows English UI.
- Android locale changes are reflected when the app returns to foreground.
- Validation errors and notification copy are localized.
- No hardcoded user-facing Korean/English strings remain outside the translation layer, except identifiers and test fixtures.

## Test Matrix

- Android device language `ko-KR`
- Android device language `en-US`
- iOS app language `Korean`
- iOS app language `English`
- App foreground relaunch after language change

## Risks

- Missing strings in edge UI paths
- Native metadata left untranslated
- Notification copy diverging from UI copy if translations are not centralized

## Deliverables

- Translation infrastructure
- Korean and English dictionaries
- Updated app config for supported locales
- Localization QA checklist

## Exit Gate

Do not begin full notification rollout until notification copy is sourced from the translation layer.

## Source Notes

- Expo localization guide: https://docs.expo.dev/guides/localization/
- Expo localization API reference: https://docs.expo.dev/versions/latest/sdk/localization
