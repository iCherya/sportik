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
