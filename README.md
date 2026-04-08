# Sportik

Sportik is a React Native (Expo) app for endurance athletes — offering tools, race countdowns, training plans and personal records for swimmers, cyclists, runners and triathletes.

## Migration status

The app is being migrated from a web prototype (`_migration/sportik-full.jsx`) to a full Expo React Native app. See [`_migration/PROGRESS.md`](_migration/PROGRESS.md) for the detailed progress log.

| Phase | Description | Status |
| --- | --- | --- |
| 0 | Install dependencies | ✅ Done |
| 1 | Foundation files (theme, i18n, data, storage, fonts) | ✅ Done |
| 2 | Root app and navigation | ✅ Done |
| 3 | Shared UI components | ✅ Done |
| 4 | Screens (Home, Tools, Events, Account) | ✅ Done |
| 5 | Overlays | ✅ Done |
| 6 | Tools (15 components) | ✅ Done |
| 7 | Onboarding | ✅ Done |
| 8 | Persistence wiring | ⏳ Pending |

## Technologies and Tools Used

### Expo

This project was initiated using the Expo CLI with the navigation template in TypeScript

```sh
npx create-expo-app@latest -t
```

### Key dependencies

- `expo-router` — file-based navigation
- `react-native-reanimated` — animations
- `@react-navigation/bottom-tabs` — tab bar navigation
- `@expo-google-fonts/barlow` + `@expo-google-fonts/barlow-condensed` — typography
- `@react-native-async-storage/async-storage` — persistence
- `expo-av` — audio (CadenceBeeper tool)
- `expo-haptics` — haptic feedback

### Developer tools

- 🧰 TypeScript - for static type-checking
- 🛠️ ESLint and Prettier - for linting and code formatting
- 🐶 Husky - to lint commit messages and code upon committing or pushing
