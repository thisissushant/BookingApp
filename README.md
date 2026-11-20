# Booking App

An Expo app with a bookings list and a booking detail screen. Bookings load from a fake REST API that ships inside the app, so no server is needed.

## Stack

- Expo SDK 58
- Expo Router, React Native, TypeScript
- @react-native-async-storage/async-storage for notes
- expo-glass-effect for the glass cards
- Jest with jest-expo for tests

## Install

```bash
npm install
```

## Start

```bash
npx expo start
```

Press `i` for the iOS simulator, `a` for the Android emulator, or `w` for web. Developed and tested on the iOS simulator.

## Test

```bash
npm test
```

The tests run without a device:

- `src/__tests__/check-in.test.ts` covers `canCheckIn` at 16 minutes before, 15 minutes before, and at start.
- `src/__tests__/bookings.test.ts` covers `fetchBookings` skipping invalid rows and throwing on HTTP 500.

## Fake API

The app always uses the fake fetch in `src/api/fake-server.ts`, which returns a real `Response` object, so the parsing code in `src/api/bookings.ts` runs the same way it would against a server.

The fake reads `EXPO_PUBLIC_BOOKINGS`:

| Value                  | Result                                                         |
| ---------------------- | -------------------------------------------------------------- |
| unset or anything else | Default list, the row with missing fields is skipped           |
| `empty`                | HTTP 200 with `[]`, list shows "No bookings"                   |
| `error`                | HTTP 500, list shows "Could not load bookings" and "Try again" |

```bash
EXPO_PUBLIC_BOOKINGS=empty npx expo start
EXPO_PUBLIC_BOOKINGS=error npx expo start
```

## Structure

```
src/
  api/          fetchBookings and the fake server
  app/          routes: / (list) and /bookings/[id] (detail)
  components/   Screen (safe area), GlassCard, themed-text, themed-view
  constants/    theme (from the Expo template)
  hooks/        use-theme, use-color-scheme (from the Expo template)
  lib/          canCheckIn, date and time formatting, note storage
  __tests__/    automated tests
```

## Default Expo template files used

These came with the Expo starter and were kept as they are:

- `src/constants/theme.ts`
- `src/hooks/use-theme.ts` and `use-color-scheme.ts` (with the `.web.ts` variant)
- `src/components/themed-text.tsx` and `themed-view.tsx`
- `src/global.css`
- `app.json`, `tsconfig.json`

The rest of the starter (tabs, explore screen, animated icon and related components) was removed.

## Behaviour

- Both screens keep their content inside the safe area.
- The list supports search by title (case-insensitive), pull to refresh, and an Updated time that changes after a refresh.
- The detail screen shows the title, date, local time and IANA timezone id.
- Check in is disabled until `canCheckIn` returns true.
- Notes are validated (empty and over 140 characters are rejected) and saved with AsyncStorage under the key `booking-note:<id>`. A saved note is still there when the booking is opened again.
- The detail screen uses a keyboard-avoiding scroll container so the Note field and Save note stay visible.
- Real liquid glass appears on iOS 26 and later. Other platforms use a translucent fallback.

## Time taken

About 2 hours.

## AI tools

- Tool: Claude.
- Used for: project cleanup, boilerplate and repetitive work.
