# Sportik Migration — Progress Log

This file tracks all completed migration work. Update it after every phase or significant change.

---

## Phase 0 — Install dependencies
**Date:** 2026-04-07
**Status:** ✅ Complete

### What was done
- Installed `@expo-google-fonts/barlow-condensed` and `@expo-google-fonts/barlow`
- Installed `@react-native-async-storage/async-storage`
- Installed `expo-haptics`
- Installed `expo-av`
- Installed `@react-navigation/bottom-tabs`
- Added `react-native-reanimated/plugin` to `babel.config.js`

### Already present (no reinstall needed)
- `expo-font`, `react-native-reanimated`, `react-native-safe-area-context`, `react-native-screens`, `@react-navigation/native`

---

## Phase 1 — Foundation files
**Date:** 2026-04-07
**Status:** ✅ Complete

### Files created
| File | Description |
|---|---|
| `src/theme.ts` | `Colors`, `Sports`, `SportKey`, `Font`, `Space` design tokens |
| `src/context/ThemeContext.tsx` | `ThemeContext` + `useIsDark` hook |
| `src/context/LangContext.tsx` | `LangContext`, `Lang` type, `useLang` hook |
| `src/i18n.ts` | Full `TRANSLATIONS` object (EN + UK), `LangKey` type, `useT` hook |
| `src/data/index.ts` | `QUOTES`, `PLAN_WEEKS`, `TODAY_SESSIONS`, `EVENTS_DATA`, `TOOLS` arrays + TypeScript types |
| `src/storage.ts` | `Storage` AsyncStorage wrapper + `STORAGE_KEYS` constants |
| `src/fonts.ts` | `useSportikFonts` hook loading all 6 Barlow font variants |

### Notes
- TypeScript check passed clean (`npx tsc --noEmit --skipLibCheck`)

---

## Phase 2 — Root app and navigation
**Date:** 2026-04-07
**Status:** ✅ Complete

### Files created / modified

| File | Description |
| --- | --- |
| `src/types.ts` | `Screen`, `Profile`, `PRData`, `OverlayType` TypeScript types |
| `app/_layout.tsx` | Rewritten: font loading via `useSportikFonts`, splash screen management, bare `<Stack>` |
| `app/index.tsx` | Entry route: loads persisted `isDark`/`lang`/`profile`, provides `ThemeContext` + `LangContext`, renders `MainApp` |
| `src/MainApp.tsx` | App shell: `screen`, `overlay`, `favs`, `personalEvents`, `doneSessions`, `qi` state; persist on change; placeholder nav + screen area |
| `.eslintrc.js` | Added `@typescript-eslint/no-unused-vars` rule with `varsIgnorePattern`/`argsIgnorePattern: '^_'` |

### Architecture notes

- `isDark` and `lang` are managed in `app/index.tsx` (not `_layout.tsx`) so their setters can be passed as props to `MainApp` → `AccountScreen`
- Onboarding is auto-skipped with a default profile until Phase 7 builds the real flow
- Derived values (`nextRace`, `dateStr`, `greeting`) and `qi`/`overlay` are declared in `MainApp` but prefixed `_` until Phase 4 screens consume them
- `MainApp` renders a placeholder screen area and a functional emoji nav bar

### Verification

- `npx tsc --noEmit --skipLibCheck` — clean
- `npx eslint ... --max-warnings=0` — clean
