# Sportik — Expo React Native Migration
## Instructions for Claude Code

You are migrating the Sportik web prototype into an Expo React Native app.
The source of truth is `sportik-full.jsx` — a single ~4000-line React JSX file
that runs as a web phone mockup. Every screen, every tool, every piece of logic
and copy is already there. Your job is to rebuild it in Expo RN, file by file,
incrementally, never breaking what already works.

**Read this document fully before writing a single line of code.**

---

## How to work

- Migrate one phase at a time. Complete and verify each phase before starting the next.
- After each file, confirm it compiles and (where possible) renders correctly.
- Never modify `sportik-full.jsx` — it is read-only reference.
- When in doubt about UI, layout, copy, or logic — check `sportik-full.jsx`.
- All business logic (calculators, zone formulas, lap timer) must be ported exactly.
- All text strings must come from the `TRANSLATIONS` object in the prototype.

## Progress tracking rules

After completing any phase or significant change:

1. **Log it in `_migration/PROGRESS.md`** — add an entry with date, status, and a list of files created or changed.
2. **Update `README.md`** — reflect the current migration status table and any new dependencies or notable changes.

These two files are the source of truth for what has been done. Read `PROGRESS.md` at the start of any new session to understand where work left off.

---

## Phase 0 — Install dependencies

Run these before anything else:

```bash
npx expo install @expo-google-fonts/barlow-condensed @expo-google-fonts/barlow
npx expo install expo-font
npx expo install @react-native-async-storage/async-storage
npx expo install expo-haptics
npx expo install react-native-reanimated
npx expo install expo-av
npx expo install react-native-safe-area-context react-native-screens
npx expo install @react-navigation/native @react-navigation/bottom-tabs
```

Add to `babel.config.js`:
```js
plugins: ['react-native-reanimated/plugin']
```

---

## Phase 1 — Foundation files

Create these files first. Everything else depends on them.

### `src/theme.ts`
Copy the `T` object and `SP` object verbatim from the top of `sportik-full.jsx`.
Export them as typed constants.

```ts
export const Colors = {
  bg:        '#0D0D0F',
  surface:   '#141416',
  card:      '#1C1C1F',
  cardHi:    '#222226',
  border:    '#2A2A2E',
  borderSub: '#1E1E22',
  text:      '#F0F0EE',
  textMid:   '#9090A0',
  textDim:   '#505060',
  swim:      '#3B9EFF', swimBg: '#0F2540',
  bike:      '#FF8B3B', bikeBg: '#2A1800',
  run:       '#3BCC7A', runBg:  '#0A2018',
  tri:       '#B57BFF', triBg:  '#1A0D2E',
  heart:     '#FF4F6A',
  accent:    '#E8FF47',
} as const;

export const Sports = {
  all:  { color: Colors.accent, bg: '#1a1a0a', icon: '⚡', label: 'All' },
  swim: { color: Colors.swim,   bg: Colors.swimBg, icon: '🏊', label: 'Swim' },
  bike: { color: Colors.bike,   bg: Colors.bikeBg, icon: '🚴', label: 'Bike' },
  run:  { color: Colors.run,    bg: Colors.runBg,  icon: '🏃', label: 'Run' },
  tri:  { color: Colors.tri,    bg: Colors.triBg,  icon: '🔱', label: 'Tri' },
} as const;

export type SportKey = keyof typeof Sports;

// Typography shorthand
export const Font = {
  condensed: 'BarlowCondensed',
  body:      'Barlow',
} as const;

// Common spacing
export const Space = {
  screen: 20,   // horizontal screen padding
  card:   18,   // card internal padding
  radius: { sm: 10, md: 14, lg: 18, xl: 22, card: 20, overlay: 28 },
} as const;
```

### `src/i18n.ts`
Copy the entire `TRANSLATIONS` object from `sportik-full.jsx` (around line 615).
Export it plus the `useT` hook adapted for React Native:

```ts
import { useContext } from 'react';
import { LangContext } from './context/LangContext';

export const TRANSLATIONS = { en: { ... }, uk: { ... } }; // copy verbatim

export type LangKey = keyof typeof TRANSLATIONS.en;

export function useT() {
  const lang = useContext(LangContext);
  return (key: LangKey): string =>
    TRANSLATIONS[lang]?.[key] ?? TRANSLATIONS.en[key] ?? key;
}
```

### `src/data/index.ts`
Copy all mock data arrays from `sportik-full.jsx` verbatim:
- `QUOTES` array
- `EVENTS_DATA` array — add proper TypeScript types
- `TOOLS` array
- `PLAN_WEEKS` array
- `TODAY_SESSIONS` array

Define types:
```ts
export type Event = {
  id: number; name: string; sport: SportKey;
  dist: string; location: string; date: string;
  days: number; fav: boolean; global: boolean;
  notes?: string;
};

export type Tool = {
  id: string; name: string; desc: string;
  sport: SportKey; icon: string; tag: string;
};

export type Session = {
  id: string; sport: SportKey; title: string;
  detail: string; duration: string; type: string; done: boolean;
};
```

### `src/context/ThemeContext.tsx`
```tsx
import React, { createContext, useContext, useState } from 'react';
export const ThemeContext = createContext(true); // true = dark
export const useIsDark = () => useContext(ThemeContext);
```

### `src/context/LangContext.tsx`
```tsx
import React, { createContext, useContext, useState } from 'react';
export type Lang = 'en' | 'uk';
export const LangContext = createContext<Lang>('en');
export const useLang = () => useContext(LangContext);
```

### `src/storage.ts`
Wrapper around AsyncStorage for persisting user data:
```ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export const Storage = {
  async get<T>(key: string): Promise<T | null> {
    const v = await AsyncStorage.getItem(key);
    return v ? JSON.parse(v) : null;
  },
  async set(key: string, value: unknown): Promise<void> {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  },
  async remove(key: string): Promise<void> {
    await AsyncStorage.removeItem(key);
  },
};

// Keys
export const STORAGE_KEYS = {
  profile:        'sportik_profile',
  onboarded:      'sportik_onboarded',
  lang:           'sportik_lang',
  isDark:         'sportik_dark',
  favs:           'sportik_favs',
  personalEvents: 'sportik_personal_events',
  doneSessions:   'sportik_done_sessions',
  prHistory:      'sportik_pr_history',
} as const;
```

### `src/fonts.ts`
Font loading helper using `expo-font` and `@expo-google-fonts`:
```ts
import { useFonts } from 'expo-font';
import {
  BarlowCondensed_700Bold,
  BarlowCondensed_800ExtraBold,
  BarlowCondensed_900Black,
} from '@expo-google-fonts/barlow-condensed';
import {
  Barlow_400Regular,
  Barlow_500Medium,
  Barlow_600SemiBold,
} from '@expo-google-fonts/barlow';

export function useSportikFonts() {
  return useFonts({
    BarlowCondensed: BarlowCondensed_700Bold,
    BarlowCondensedBold: BarlowCondensed_800ExtraBold,
    BarlowCondensedBlack: BarlowCondensed_900Black,
    Barlow: Barlow_400Regular,
    BarlowMedium: Barlow_500Medium,
    BarlowSemiBold: Barlow_600SemiBold,
  });
}
```

---

## Phase 2 — Root app and navigation

### `src/types.ts`
Define the root state shape and overlay types:
```ts
export type Screen = 'home' | 'tools' | 'events' | 'account';

export type OverlayType =
  | { type: 'tool'; tool: Tool }
  | { type: 'pr'; pr: PRData }
  | { type: 'plan' }
  | { type: 'about' }
  | { type: 'editProfile'; profile: Profile; onSave: (p: Profile) => void }
  | { type: 'hrZones'; maxHR: string; hrMethod: string; onSave: (v: any) => void };

export type Profile = {
  name: string; city: string; focus: string; avatar: string;
  raceType: string; raceDate: string;
  maxHR: string; ftp: string; hoursPerWeek: number;
};
```

### `app/_layout.tsx`
Root layout. Load fonts, provide contexts, show splash until fonts ready:
```tsx
export default function RootLayout() {
  const [fontsLoaded] = useSportikFonts();
  const [isDark, setIsDark] = useState(true);
  const [lang, setLang] = useState<Lang>('en');

  // Load persisted preferences on mount
  useEffect(() => {
    Storage.get<boolean>(STORAGE_KEYS.isDark).then(v => v !== null && setIsDark(v));
    Storage.get<Lang>(STORAGE_KEYS.lang).then(v => v && setLang(v));
  }, []);

  if (!fontsLoaded) return <SplashScreen />;

  return (
    <ThemeContext.Provider value={isDark}>
      <LangContext.Provider value={lang}>
        <Stack screenOptions={{ headerShown: false }} />
      </LangContext.Provider>
    </ThemeContext.Provider>
  );
}
```

### `app/index.tsx`
Entry point — checks onboarded state, shows onboarding or main app:
```tsx
export default function Index() {
  const [onboarded, setOnboarded] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      Storage.get<boolean>(STORAGE_KEYS.onboarded),
      Storage.get<Profile>(STORAGE_KEYS.profile),
    ]).then(([ob, prof]) => {
      if (ob) setOnboarded(true);
      if (prof) setProfile(prof);
      setLoading(false);
    });
  }, []);

  const handleOnboardingComplete = async (data: Profile) => {
    setProfile(data);
    setOnboarded(true);
    await Storage.set(STORAGE_KEYS.profile, data);
    await Storage.set(STORAGE_KEYS.onboarded, true);
  };

  if (loading) return <SplashScreen />;
  if (!onboarded) return <Onboarding onComplete={handleOnboardingComplete} />;
  return <MainApp profile={profile} setProfile={setProfile} />;
}
```

### `src/MainApp.tsx`
The main tabbed app shell. Manages screen-level state, overlay rendering,
shared state (favs, personalEvents, doneSessions, qi, lang, isDark).

Reference the root `Sportik()` function in `sportik-full.jsx` for exact state shape.
Key shared state to lift here:
- `favs: number[]` — favourited event IDs
- `personalEvents: Event[]` — user-created events
- `doneSessions: Record<string, boolean>` — checked training sessions
- `qi: number` — current quote card index
- `overlay: OverlayType | null`
- `screen: Screen`

Persist to AsyncStorage whenever these change.

---

## Phase 3 — Shared UI components

Build these before any screens. They are used everywhere.

### `src/components/Text.tsx`
Typed text component that always uses Barlow fonts:
```tsx
// Usage: <AppText size={16} weight="bold" color={Colors.text}>Hello</AppText>
// Condensed variant: <AppText condensed size={24} weight="black">SPORTIK</AppText>
```

### `src/components/Card.tsx`
Standard card with border and background from theme.

### `src/components/Button.tsx`
Three variants matching the prototype: `accent` (lime), `danger` (red), `ghost` (dashed border), `surface`.

### `src/components/Toggle.tsx`
Copy the toggle logic from `sportik-full.jsx` (`Toggle` component). Use `Animated` for the sliding dot.

### `src/components/Sheet.tsx`
Bottom sheet with slide-up/down animation using `react-native-reanimated`.
- Slides up on mount
- Slides down on close (220ms), then calls `onClose`
- Backdrop tap closes sheet
- Drag handle at top
- Match the `Sheet` component in `sportik-full.jsx`

### `src/components/BottomNav.tsx`
Tab bar with 4 items: Home, Tools, Events, Account.
- Sliding accent indicator (2px line above active tab)
- Animate indicator position with `Animated.Value` or Reanimated
- Labels use `useT()` for i18n
- Match exactly: icons (🏠🛠📅👤), label style, active accent color

### `src/components/Overlay.tsx`
Full-screen overlay wrapper that slides up from bottom.
Used for: ToolDetail, PRDetail, PlanOverlay, HRZonesOverlay, EditProfileOverlay, AboutOverlay.
- Slides up on mount with Reanimated
- Back button in header
- Safe area aware

---

## Phase 4 — Screens

Build screens in this order: Home → Tools → Events → Account.
Each screen is a ScrollView (or flat layout) that fits between the status bar and bottom nav.

### `src/screens/HomeScreen.tsx`

Props (passed from MainApp):
```ts
profile: Profile | null
nextRace: Event | null        // derived: nearest upcoming favourited event
dateStr: string               // live formatted date
greeting: string              // Morning / Afternoon / Evening (translated)
doneSessions: Record<string, boolean>
setDoneSessions: (fn) => void
qi: number
setQi: (n: number) => void
onOpenTool: (tool: Tool) => void
onOpenPlan: () => void
```

Sections to build (in order, matching the prototype):
1. **Greeting** — date string + name with accent color
2. **Quote card** — swipeable carousel with left/right gesture. Port the `QuoteCard`
   component logic exactly. Use `PanResponder` or Reanimated gesture for swipe.
   Fixed height container so layout never jumps between quotes.
3. **Race countdown** — shows nearest favourited upcoming event. If none, shows
   nudge card. Pulls from `nextRace` prop.
4. **Weekly load bars** — static for now (3 sport bars, fixed values)
5. **Today's training** — session list with checkboxes. Persist `doneSessions`.
   Show progress bar when any session is ticked.
6. **Quick tools** — 4 shortcut buttons (Pace Calc, Cadence, HR Zones, Splits)
7. **Training plans** — list of plan templates with ACTIVE badge

### `src/screens/ToolsScreen.tsx`

Layout: sticky filter tabs at top, scrollable tool list below.

```
┌─────────────────────────────┐
│ Tools                       │  ← page header (fixed)
│ 15 tools for athletes       │
├──┬──┬──┬──┬──────────────── │
│All│🏊│🚴│🏃│🔱             │  ← sport tabs (horizontally scrollable, vertically FIXED)
├─────────────────────────────┤
│ [tool card]                 │  ← scrollable list
│ [tool card]                 │
│ ...                         │
└─────────────────────────────┘
```

- Sport tabs: use `ScrollView horizontal` with `scrollEnabled` + intercept vertical gestures
- Tool cards: sport color accent stripe on left, icon, name, description, tag badge, › chevron
- Tapping a tool opens `ToolDetail` overlay

### `src/screens/EventsScreen.tsx`

Two-tab layout: Discover / My Events.

**Discover tab:**
- Filter chips (All / Tri / Run / Bike / Swim) — horizontal scroll row
- Event card list
- "Suggest a Missing Event" dashed button at bottom

**My Events tab:**
- Empty state if no favs: star icon, text, "Browse Events →" button
- Upcoming section: count label + event cards
- Archived toggle: collapsible list of past events
- "Add Personal Event" dashed button at bottom

**Sheets (render over screen):**
- `AddEventSheet` — validated form: name, sport picker, distance, date, location, notes
- `SuggestSheet` — form: name, sport, location, date, distance, description

**Event detail:** full overlay (not a sheet), slides up. Shows countdown ring,
info rows, save/unsave button.

Props: `favs`, `setFavs`, `personalEvents`, `setPersonalEvents`

### `src/screens/AccountScreen.tsx`

Sections:
1. **Hero** — avatar picker emoji, name, sport/city, plan label, 4 PR boxes
2. **Training Profile** group — FTP row, HR Zones row (opens overlay), Season Goal row
3. **Preferences** group — Notifications toggle, Dark Mode toggle, Units picker, HR Method picker
4. **App** group — Suggest Feature, Rate Sportik, Language picker, About
5. **Log Out** button — confirmation sheet

All rows use the `Row` component (icon box, label, right value + chevron).
All sheets use the `Sheet` component.
HR Zones row opens the full `HRZonesOverlay` (not a sheet).

---

## Phase 5 — Overlays

### `src/overlays/ToolDetail.tsx`
Header: back button, sport chip, tool name.
Body: renders the appropriate tool component by `tool.id`.
Map: `{ pace: PaceCalc, cadence: CadenceBeeper, hr: HRZones, ... }`

### `src/overlays/HRZonesOverlay.tsx`
Full overlay (not a sheet). Port from `HRZonesOverlay` in the prototype.
Features:
- Method picker (Max HR % / HR Reserve)
- Max HR input with age presets (25/30/35/40/45)
- Resting HR input (shown only for HR Reserve)
- 5 zone rows — each tappable to expand and manually override BPM bounds
- "CUSTOM" badge when zone is manually overridden
- "Reset to auto" per zone
- "Reset all" button
- Save button persists to profile

### `src/overlays/PRDetail.tsx`
Port from `PRDetail` in the prototype.
- Personal best hero card
- History list (empty state when only 1 result)
- Log new result inline form (Time + Event/Note inputs)
- Adding a result prepends to history list

### `src/overlays/PlanOverlay.tsx`
Port from `PlanOverlay` in the prototype.
- Plan meta (Duration, Level, Race date)
- Session list with checkboxes (local state)
- AI plans promo card at bottom

### `src/overlays/EditProfileOverlay.tsx`
Port from `EditProfileOverlay`.
- Emoji avatar picker (10 options)
- Name input
- City input
- Sport focus selector (Triathlete / Runner / Cyclist / Swimmer)
- Save writes back to root profile state + AsyncStorage

### `src/overlays/AboutOverlay.tsx`
Static info screen. Port from `AboutOverlay` in the prototype.

---

## Phase 6 — Tools (15 components)

Each tool is a self-contained component with no props.
All logic is internal useState. Port the logic exactly from the prototype.

Create in `src/tools/`:

| File | Logic notes |
|---|---|
| `PaceCalc.tsx` | h/m/s inputs + distance → pace. Also shows speed and marathon equiv |
| `CadenceBeeper.tsx` | BPM slider + tap beat. Use `expo-av` for click sound (replace Web Audio API). `setInterval` for beat timing |
| `HRZones.tsx` | Max HR + method → 5 zones. Two methods: Max HR % and Karvonen (HR Reserve) |
| `PowerZones.tsx` | FTP input → 7 power zones as % of FTP |
| `SpeedPace.tsx` | km/h ↔ min/km live converter |
| `RaceSplitPlanner.tsx` | Race type picker + target time → per-leg split breakdown |
| `RaceTimePredictor.tsx` | Known race result → predict longer race time (Riegel formula) |
| `NutritionCalc.tsx` | Duration + intensity → carbs/hour and fluid/hour |
| `SwolfCalc.tsx` | Strokes + seconds per lap → SWOLF score + rating |
| `PoolCounter.tsx` | Multi-swimmer lap counter with per-lap timer. Complex — port carefully |
| `WetsuitGuide.tsx` | Water temp slider → wetsuit recommendation with rules |
| `CalorieBurn.tsx` | Weight + duration + sport → kcal estimate |
| `RaceChecklist.tsx` | Race type picker + itemised checklist with checkboxes |
| `TaperCalc.tsx` | Race type + weeks-to-race → weekly volume reduction plan |
| `TransitionEstimator.tsx` | Experience level + extras → T1/T2 time estimate |

### CadenceBeeper — audio note
The web prototype uses the Web Audio API (`AudioContext`). In Expo use `expo-av`:
```ts
import { Audio } from 'expo-av';
// Generate a short click sound, or load a bundled audio asset
// Play on each beat tick instead of oscillator
```

### PoolCounter — complexity note
This is the most complex tool. It has:
- Multiple swimmers (add/remove)
- Per-swimmer lap list with timestamps
- Live elapsed timer (100ms interval)
- Pause/resume per swimmer
- Lap history table with best lap highlight and delta-from-average

Port every piece of logic exactly. The `handleTap` function is critical — read it carefully.

---

## Phase 7 — Onboarding

6 screens with slide transition between them.

Use `react-native-reanimated` for the slide animation between steps.
Each screen slides in from right (forward) or left (backward).

### Screens (in order):
1. `OBWelcome` — wordmark, tagline, feature pills, sport icons, Skip → button top-right, Get Started button
2. `OBSportFocus` — multi-select sport cards (Tri/Run/Bike/Swim/Not decided), Continue disabled until ≥1 selected
3. `OBGoalRace` — Yes/No toggle, race type list, date picker. Skip allowed
4. `OBBaseline` — Max HR + FTP inputs (FTP only for bike/tri). Skip allowed
5. `OBTrainingHours` — slider 3–20h, live level badge (Base/Intermediate/Advanced/Elite), sport breakdown
6. `OBReady` — name input, summary of filled items, skipped items as tags, Let's Go button

### `OBProgress` component
Progress bar + step counter + Back/Skip buttons. Used on steps 1–5.

### Skip-all pill
On steps 1–4, show a floating "Skip onboarding entirely" pill at the bottom.
Tapping it immediately completes onboarding with default values.

### Data flow
Onboarding collects: `sports[]`, `raceType`, `raceDate`, `maxHR`, `ftp`, `hoursPerWeek`, `name`.
On completion, writes to `profile` state + AsyncStorage.

---

## Phase 8 — Persistence

Wire AsyncStorage throughout. Every state that should survive app restart:

| State | Key | When to save |
|---|---|---|
| `profile` | `sportik_profile` | On onboarding complete + edit profile save |
| `onboarded` | `sportik_onboarded` | On onboarding complete |
| `lang` | `sportik_lang` | On language change |
| `isDark` | `sportik_dark` | On toggle |
| `favs` | `sportik_favs` | On star/unstar event |
| `personalEvents` | `sportik_personal_events` | On add/remove personal event |
| `doneSessions` | `sportik_done_sessions` | On tick/untick session. Clear at midnight |
| `prHistory` | `sportik_pr_history` | On log new PR result |

Load all persisted values in `app/index.tsx` before rendering anything.

---

## Key Web → React Native translation rules

Apply these everywhere:

| Web (prototype) | React Native |
|---|---|
| `<div>` | `<View>` |
| `<span>` | `<Text>` |
| `<p>` | `<Text>` |
| `<button onClick>` | `<Pressable onPress>` or `<TouchableOpacity>` |
| `<input type="text">` | `<TextInput>` |
| `<input type="range">` | `<Slider>` from `@react-native-community/slider` |
| `<input type="date">` | Use `DateTimePicker` from `@react-native-community/datetimepicker` |
| `<textarea>` | `<TextInput multiline>` |
| `overflow-y: auto` scroll | `<ScrollView>` |
| `display: flex` | `<View style={{ flexDirection: 'row' }}>` (default is column in RN) |
| `gap: 8` | Use `gap: 8` (supported in RN 0.71+) or add `margin` to children |
| CSS animations | `react-native-reanimated` or `Animated` API |
| `position: absolute; inset: 0` | `StyleSheet.absoluteFillObject` |
| `border-radius` | Same, but no `overflow: hidden` needed for children usually |
| `font-family: 'Barlow Condensed'` | `fontFamily: 'BarlowCondensed'` (loaded font name) |
| `letter-spacing: 2px` | `letterSpacing: 2` |
| `text-transform: uppercase` | `textTransform: 'uppercase'` |
| `cursor: pointer` | Not needed — touchable components handle this |
| `transition: all .15s` | `Animated` or Reanimated with `withTiming` |
| Web Audio API (CadenceBeeper) | `expo-av` |
| `localStorage` | `AsyncStorage` |
| `useRef` for DOM | `useRef` still works for timers/values |
| `window.AudioContext` | Replace with `expo-av` Sound |

---

## Animations reference

The prototype uses CSS keyframe animations. Port to Reanimated:

| CSS animation | Reanimated equivalent |
|---|---|
| Screen slide in from right | `withTiming` on `translateX` from `width` to `0` |
| Screen slide in from left | `withTiming` on `translateX` from `-width` to `0` |
| Overlay slide up | `withTiming` on `translateY` from `height` to `0` |
| Sheet slide up/down | Same, scoped to sheet height |
| Quote card slide | Two simultaneous animations: current slides out, next slides in |
| Bottom nav indicator | `withTiming` on `left` position |
| Toggle dot | `withTiming` on `left` (3 → 21) |

---

## Design fidelity rules

- Match the prototype visually as closely as possible
- Font sizes, weights, letter-spacing must match exactly
- Colors must be exact hex values from `src/theme.ts`
- Border radius values: cards=20, buttons=14–16, chips=20, overlay=28
- Standard horizontal padding: 20
- Bottom nav height: 84, with 16px bottom padding for home indicator area
- Use `SafeAreaView` to handle notch/status bar

---

## File structure to create

```
src/
  theme.ts
  i18n.ts
  types.ts
  storage.ts
  fonts.ts

  context/
    ThemeContext.tsx
    LangContext.tsx

  data/
    index.ts          ← QUOTES, EVENTS_DATA, TOOLS, PLAN_WEEKS, TODAY_SESSIONS

  components/
    AppText.tsx
    Card.tsx
    Button.tsx
    Toggle.tsx
    Sheet.tsx
    BottomNav.tsx
    Overlay.tsx
    NumberInput.tsx
    Row.tsx           ← account settings row

  screens/
    HomeScreen.tsx
    ToolsScreen.tsx
    EventsScreen.tsx
    AccountScreen.tsx

  overlays/
    ToolDetail.tsx
    HRZonesOverlay.tsx
    PRDetail.tsx
    PlanOverlay.tsx
    EditProfileOverlay.tsx
    AboutOverlay.tsx

  tools/
    PaceCalc.tsx
    CadenceBeeper.tsx
    HRZones.tsx
    PowerZones.tsx
    SpeedPace.tsx
    RaceSplitPlanner.tsx
    RaceTimePredictor.tsx
    NutritionCalc.tsx
    SwolfCalc.tsx
    PoolCounter.tsx
    WetsuitGuide.tsx
    CalorieBurn.tsx
    RaceChecklist.tsx
    TaperCalc.tsx
    TransitionEstimator.tsx

  onboarding/
    Onboarding.tsx
    OBProgress.tsx
    OBWelcome.tsx
    OBSportFocus.tsx
    OBGoalRace.tsx
    OBBaseline.tsx
    OBTrainingHours.tsx
    OBReady.tsx

  MainApp.tsx

app/
  _layout.tsx
  index.tsx
```

---

## Start here

When you open this project, begin with Phase 0 (install deps), then Phase 1 (foundation files).
Do not jump ahead. The foundation files are dependencies for everything else.

After Phase 1 is complete, run `npx expo start` and confirm the app launches
(even if it shows a blank screen — just confirm no import errors).

Then proceed phase by phase. After each phase, run the app and verify.

The prototype (`sportik-full.jsx`) is your specification. Match it.
