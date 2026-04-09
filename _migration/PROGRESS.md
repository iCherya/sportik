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

---

## Phase 5 — Overlays

**Date:** 2026-04-07 | **Status:** ✅ Complete

### Phase 5 — Files created / modified

| File | Description |
| --- | --- |
| `src/components/Overlay.tsx` | Added `backLabel?: string` (defaults to `'Back'`) and `badge?: React.ReactNode` props for contextual back labels and sport chips |
| `src/overlays/ToolDetail.tsx` | Overlay with sport badge + tool name header; tool body placeholder until Phase 6 fills in the 15 tool components |
| `src/overlays/HRZonesOverlay.tsx` | Full HR zones config: method picker (Max HR % / HR Reserve), max HR input with age presets, optional resting HR input, 5 expandable zone rows with manual BPM override + per-zone reset, save callback |
| `src/overlays/PRDetail.tsx` | PR hero card, history list with BEST badge (empty state when only 1 result), inline log-new-result form with time + event inputs |
| `src/overlays/PlanOverlay.tsx` | Plan meta row, week header with progress bar, session list with sport stripes + tap-to-toggle checkboxes, AI plans promo card |
| `src/overlays/EditProfileOverlay.tsx` | Emoji avatar picker (10 options), name + city TextInputs, sport focus selector, save writes back to root profile state |
| `src/overlays/AboutOverlay.tsx` | SPORTIK wordmark, version, BETA badge, info rows card, privacy/terms/oss link rows |
| `src/MainApp.tsx` | Replaced overlay stub with `renderOverlay()` switch wiring all 6 overlay components |

### Phase 5 — Architecture notes

- `Overlay.tsx` `badge` prop renders between the back button and title — used by ToolDetail, PRDetail, HRZonesOverlay, PlanOverlay for sport chips
- `backLabel` defaults to `'Back'` for backwards compatibility; overlays pass `t('nav_tools')` / `t('nav_account')` / `t('nav_home')` as appropriate
- `ToolDetail` body renders a placeholder ("Tool UI coming in Phase 6") — the component map will be filled in Phase 6
- HR zone BPM values are kept as strings throughout to avoid lossy int↔string conversion in TextInput; `calcAuto` returns `string` via `String(...)`

### Phase 5 — Verification

- `npx tsc --noEmit --skipLibCheck` — clean
- `npx eslint src/overlays/ src/components/Overlay.tsx src/MainApp.tsx --max-warnings=0` — clean (after Prettier auto-fix)

---

## Phase 6 — Tools (15 components)

**Date:** 2026-04-08 | **Status:** ✅ Complete

### Phase 6 — Files created / modified

| File | Description |
| --- | --- |
| `src/tools/PaceCalc.tsx` | Sport selector (run/bike/swim), h/m/s + distance inputs, pace + speed result, marathon equiv |
| `src/tools/SpeedPace.tsx` | Bidirectional km/h ↔ min/km converter with bike time info rows |
| `src/tools/PowerZones.tsx` | FTP input → 7 power zones (Z1–Z7), 'Max' label for neuromuscular zone |
| `src/tools/HRZones.tsx` | Max HR / HR Reserve method selector, 5 zones with mini percentage bars |
| `src/tools/RaceTimePredictor.tsx` | Known time + distance → Riegel formula predictions for 5K/10K/HM/Marathon presets |
| `src/tools/NutritionCalc.tsx` | Duration + intensity → carbs/fluid/sodium/gels per hour |
| `src/tools/SwolfCalc.tsx` | Pool selector, strokes + seconds → SWOLF score with Elite/Advanced/Intermediate/Developing rating |
| `src/tools/WetsuitGuide.tsx` | Water temp → 6-tier wetsuit rule table (Danger/Required/Allowed/Optional/Banned/Too Hot) |
| `src/tools/CalorieBurn.tsx` | Sport + weight + duration + intensity → kcal via MET table |
| `src/tools/RaceSplitPlanner.tsx` | 4 triathlon distances + target time → 5 split rows (swim/T1/bike/T2/run) |
| `src/tools/TransitionEstimator.tsx` | Experience level → T1/T2 time estimates + tips checklist |
| `src/tools/TaperCalc.tsx` | Race type + weeks out → phase rows with swim/bike/run volume bar charts |
| `src/tools/CadenceBeeper.tsx` | BPM metronome with expo-haptics tactile beat, +/−1/+/−5 buttons, presets, sport selector |
| `src/tools/RaceChecklist.tsx` | Race type selector (tri/run/bike), grouped checklist with tap-to-check and progress bar |
| `src/tools/PoolCounter.tsx` | Multi-swimmer lap counter with live timer, lap history table, pause/undo/reset, add-swimmer modal |
| `src/overlays/ToolDetail.tsx` | `TOOL_BODIES` map wiring all 15 tool IDs to their JSX elements |

### Phase 6 — Architecture notes

- No `@react-native-community/slider` installed — `CadenceBeeper` uses +/−1/+/−5 `Pressable` buttons for BPM control; `expo-haptics` replaces Web Audio API oscillators
- `PoolCounter` uses `_tick` (underscore-prefixed) for the 100ms display-ticker state to satisfy `@typescript-eslint/no-unused-vars` (only the setState call matters for re-renders)
- `AppText` `style` prop accepts only flat `TextStyle`, not arrays — all tools use flat inline style objects
- `CalorieBurn` includes an `'all'` entry in the METS record with fallback values so `Sports[sport]` indexing satisfies TypeScript without casts
- All 15 tools have internal state only, no props — composed directly as JSX in the `TOOL_BODIES` constant

### Phase 6 — Verification

- `npx tsc --noEmit` — clean
- `npx eslint src/tools/ src/overlays/ToolDetail.tsx --max-warnings=0` — clean (after Prettier auto-fix + removing unused `useRef` import in PoolCounter)

---

## Phase 7 — Onboarding

**Date:** 2026-04-08 | **Status:** ✅ Complete

### Phase 7 — Files created / modified

| File | Description |
| --- | --- |
| `src/onboarding/Onboarding.tsx` | Full 6-step onboarding flow: Welcome → Sport Focus → Goal Race → Baseline → Training Hours → Ready |
| `app/index.tsx` | Removed auto-complete placeholder; renders `<Onboarding>` when `!onboarded`; `handleOnboardingComplete` builds `Profile` and persists it |

### Phase 7 — Architecture notes

- Slide transitions use Reanimated `useSharedValue` + `withTiming` (320ms) via a keyed `SlideIn` wrapper — same pattern as `Overlay.tsx` but horizontal instead of vertical
- No `@react-native-community/datetimepicker` — GoalRace uses a plain `TextInput` with `YYYY-MM-DD` placeholder for the race date
- No range slider — TrainingHours uses +1/−1 `Pressable` buttons (min 3, max 20) plus 6 preset chips (3/5/8/12/16/20h)
- `OBData` is exported from `Onboarding.tsx` so `app/index.tsx` can type the `handleOnboardingComplete` callback
- `onSkipAll` writes the `DEFAULT_PROFILE` and sets `onboarded = true` without entering the flow
- FTP card in Baseline is only shown when sports includes `'bike'` or `'tri'`
- "Skip onboarding entirely" floating pill appears on steps 1–4 (not Welcome or Ready)

### Phase 7 — Verification

- `npx tsc --noEmit` — clean
- `npx eslint src/onboarding/ app/index.tsx --max-warnings=0` — clean (after Prettier auto-fix)

---

## Phase 8 — Persistence wiring

**Date:** 2026-04-08 | **Status:** ✅ Complete

### Phase 8 — Files modified

| File | Change |
| --- | --- |
| `app/index.tsx` | Added `handleSetProfile` wrapper that calls `Storage.set(STORAGE_KEYS.profile, p)` before `setProfile(p)`; passed as `setProfile` prop to `MainApp` so all profile edits (EditProfileOverlay, etc.) are automatically persisted |
| `src/overlays/PRDetail.tsx` | Replaced hardcoded `useState` history with `useEffect` load from `STORAGE_KEYS.prHistory` (keyed by `pr.label`) and `saveHistory` write on each new log entry |

### Phase 8 — What was already wired (no changes needed)

| State | Where persisted |
| --- | --- |
| `isDark` | `AccountScreen` — `Storage.set` in `handleToggleDark` |
| `lang` | `AccountScreen` — `Storage.set` in `handleLangSelect` |
| `favs` | `MainApp` — `useEffect` on change |
| `personalEvents` | `MainApp` — `useEffect` on change |
| `doneSessions` | `MainApp` — `useEffect` on change |
| `profile` / `onboarded` | `app/index.tsx` — written on onboarding complete |

### Phase 8 — Verification

- `npx tsc --noEmit` — clean
- `npx eslint src/overlays/PRDetail.tsx app/index.tsx --max-warnings=0` — clean

---

## Phase 9 — Light/Dark theme wiring

**Date:** 2026-04-08 | **Status:** ✅ Complete

### Phase 9 — Files modified

| File | Change |
| --- | --- |
| `src/theme.ts` | Added `LIGHT` palette + `getColors(isDark)` helper; `ColorPalette` type derived from `DARK` |
| `src/context/ThemeContext.tsx` | Added `useColors()` hook — reads `isDark` from context, returns `getColors(isDark)` |
| All 15 `src/tools/*.tsx` | Replaced static `Colors.*` + top-level `StyleSheet.create` with `makeStyles(c: ColorPalette)` + `useMemo(() => makeStyles(colors), [colors])` |
| All 6 `src/overlays/*.tsx` | Same `makeStyles` pattern |
| All 4 `src/screens/*.tsx` | Same `makeStyles` pattern |
| `src/MainApp.tsx` | Same `makeStyles` pattern |
| `src/onboarding/Onboarding.tsx` | Same `makeStyles` pattern |
| All 8 `src/components/*.tsx` | Same `makeStyles` pattern (Button, Card, Row, Sheet, etc.) |

### Phase 9 — Architecture notes

- `ColorPalette` is typed as `typeof DARK` — `getColors` casts to `ColorPalette` so both palettes unify under one type
- `useColors()` is the single source of truth for current palette; consuming components call it directly
- `makeStyles` is always a module-level function (not inside a component) for stable reference; `useMemo` keyed on `colors` makes styles reactive to theme changes

### Phase 9 — Verification

- `npx tsc --noEmit --skipLibCheck` — clean
- `npx eslint src/ --max-warnings=0` — clean (after auto-fix)
