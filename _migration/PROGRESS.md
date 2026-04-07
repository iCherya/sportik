# Sportik Migration — Progress Log

This file tracks all completed migration work. Update it after every phase or significant change.

---

## Phase 0 — Install dependencies

**Date:** 2026-04-07 | **Status:** ✅ Complete

### Phase 0 — What was done

- Installed `@expo-google-fonts/barlow-condensed` and `@expo-google-fonts/barlow`
- Installed `@react-native-async-storage/async-storage`
- Installed `expo-haptics`
- Installed `expo-av`
- Installed `@react-navigation/bottom-tabs`
- Added `react-native-reanimated/plugin` to `babel.config.js`

### Phase 0 — Already present

- `expo-font`, `react-native-reanimated`, `react-native-safe-area-context`, `react-native-screens`, `@react-navigation/native`

---

## Phase 1 — Foundation files

**Date:** 2026-04-07 | **Status:** ✅ Complete

### Phase 1 — Files created

| File | Description |
| --- | --- |
| `src/theme.ts` | `Colors`, `Sports`, `SportKey`, `Font`, `Space` design tokens |
| `src/context/ThemeContext.tsx` | `ThemeContext` + `useIsDark` hook |
| `src/context/LangContext.tsx` | `LangContext`, `Lang` type, `useLang` hook |
| `src/i18n.ts` | Full `TRANSLATIONS` object (EN + UK), `LangKey` type, `useT` hook |
| `src/data/index.ts` | `QUOTES`, `PLAN_WEEKS`, `TODAY_SESSIONS`, `EVENTS_DATA`, `TOOLS` arrays + TypeScript types |
| `src/storage.ts` | `Storage` AsyncStorage wrapper + `STORAGE_KEYS` constants |
| `src/fonts.ts` | `useSportikFonts` hook loading all 6 Barlow font variants |

### Phase 1 — Notes

- TypeScript check passed clean (`npx tsc --noEmit --skipLibCheck`)

---

## Phase 2 — Root app and navigation

**Date:** 2026-04-07 | **Status:** ✅ Complete

### Phase 2 — Files created

| File | Description |
| --- | --- |
| `src/types.ts` | `Screen`, `Profile`, `PRData`, `OverlayType` TypeScript types |
| `app/_layout.tsx` | Rewritten: font loading via `useSportikFonts`, splash screen management, bare `<Stack>` |
| `app/index.tsx` | Entry route: loads persisted `isDark`/`lang`/`profile`, provides `ThemeContext` + `LangContext`, renders `MainApp` |
| `src/MainApp.tsx` | App shell: `screen`, `overlay`, `favs`, `personalEvents`, `doneSessions`, `qi` state; persist on change; placeholder nav + screen area |
| `.eslintrc.js` | Added `@typescript-eslint/no-unused-vars` rule with `varsIgnorePattern`/`argsIgnorePattern: '^_'` |

### Phase 2 — Architecture notes

- `isDark` and `lang` are managed in `app/index.tsx` (not `_layout.tsx`) so their setters can be passed as props to `MainApp` → `AccountScreen`
- Onboarding is auto-skipped with a default profile until Phase 7 builds the real flow
- Derived values (`nextRace`, `dateStr`, `greeting`) and `qi`/`overlay` are declared in `MainApp` but prefixed `_` until Phase 4 screens consume them

### Phase 2 — Verification

- `npx tsc --noEmit --skipLibCheck` — clean
- `npx eslint ... --max-warnings=0` — clean

---

## Phase 3 — Shared UI components

**Date:** 2026-04-07 | **Status:** ✅ Complete

### Phase 3 — Files created

| File | Description |
| --- | --- |
| `src/components/AppText.tsx` | Typed text component mapping condensed/body weights to Barlow font variants |
| `src/components/Card.tsx` | Surface card with `highlight` variant (cardHi background) |
| `src/components/Button.tsx` | 4 variants: `accent` (lime/black), `danger` (red/white), `ghost` (dashed border), `surface` |
| `src/components/Toggle.tsx` | Animated sliding dot toggle using `react-native`'s `Animated` |
| `src/components/Sheet.tsx` | Bottom sheet: Reanimated slide-up (260ms) / slide-down (220ms), backdrop tap to close, drag handle |
| `src/components/BottomNav.tsx` | 4-tab nav bar with sliding 28px accent indicator animated via `Animated.Value` |
| `src/components/Overlay.tsx` | Full-screen overlay: Reanimated slide-up (280ms) / slide-down (240ms), safe-area header, back button |
| `src/components/NumberInput.tsx` | Validated decimal input with unit badge, range check, error messaging |
| `src/components/Row.tsx` | Account-screen row: emoji icon with colored bg, label, right slot, danger variant |
| `src/types.ts` | Added `NAV_ORDER` export |
| `src/MainApp.tsx` | Replaced placeholder nav with real `BottomNav` component |

### Phase 3 — Architecture notes

- `AppText` resolves font family from `condensed` flag + `weight` prop — no raw `fontFamily` strings in screens
- `Sheet` uses `onStartShouldSetResponder` to prevent backdrop tap bleeding through sheet content
- `BottomNav` indicator position computed from `onLayout` width + tab index (no DOM measurements needed)
- `Overlay` uses `useSafeAreaInsets` for proper status-bar padding on all devices

### Phase 3 — Verification

- `npx tsc --noEmit --skipLibCheck` — clean
- `npx eslint src/components/ src/MainApp.tsx --max-warnings=0` — clean

---

## Phase 4 — Screens

**Date:** 2026-04-07 | **Status:** ✅ Complete

### Phase 4 — Files created / modified

| File | Description |
| --- | --- |
| `src/screens/HomeScreen.tsx` | Greeting, QuoteCard (horizontal paginating ScrollView), race countdown, weekly load bars, today's training with checkboxes + progress bar, quick tools, training plans |
| `src/screens/ToolsScreen.tsx` | Fixed header, horizontal sport filter tabs, scrollable tool list with sport-colored accent stripes |
| `src/screens/EventsScreen.tsx` | Discover/My Events tabs, filter chips, EventCard, EventDetail (Overlay), AddEventSheet, SuggestSheet |
| `src/screens/AccountScreen.tsx` | Hero (avatar, PRs), Training Profile group, Preferences group, App group, Log Out — all rows use `Row` component, all pickers use `Sheet` |
| `src/MainApp.tsx` | Wired all 4 screens via `renderScreen()` switch; stub overlay placeholder for types not yet built in Phase 5 |

### Phase 4 — Architecture notes

- `QuoteCard` uses a horizontal paginating `ScrollView` (not PanResponder) — more reliable inside vertical ScrollView on both platforms
- All shared state (`favs`, `personalEvents`, `doneSessions`, `qi`) persists to AsyncStorage via Phase 2 effects in `MainApp`
- `Event` type imported from `'../data'`, not `'../types'`
- Sport indexing uses `s.sport as SportKey` cast where TypeScript can't infer it from mapped data

### Phase 4 — Verification

- `npx tsc --noEmit --skipLibCheck` — clean
- `npx eslint src/screens/ src/MainApp.tsx --max-warnings=0` — clean (after Prettier auto-fix)
