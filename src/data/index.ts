import type { LangKey } from '../i18n';
import type { SportKey } from '../theme';

export type Event = {
  id: number;
  name: string;
  sport: SportKey;
  dist: string;
  location: string;
  date: string;
  days: number;
  fav: boolean;
  global: boolean;
  notes?: string;
};

export type Tool = {
  id: string;
  nameKey: LangKey;
  descKey: LangKey;
  sport: SportKey | 'all';
  icon: string;
  tag: string;
};

export type Session = {
  id: string;
  sport: SportKey;
  title: string;
  detail: string;
  duration: string;
  type: string;
  done: boolean;
};

export type PlanWeek = {
  week: number;
  sessions: Session[];
};

export const QUOTES: { text: string; author: string }[] = [
  { text: 'The body achieves what the mind believes.', author: '— Unknown' },
  { text: 'Pain is temporary. Quitting lasts forever.', author: '— Lance Armstrong' },
  { text: 'Swim. Bike. Run. Suffer. Repeat.', author: '— Every Triathlete' },
  { text: 'Your only limit is you.', author: '— Unknown' },
  { text: "Champions aren't made in gyms.", author: '— Muhammad Ali' },
];

export const PLAN_WEEKS: PlanWeek[] = [
  {
    week: 1,
    sessions: [
      {
        id: 's1',
        sport: 'swim',
        title: 'Endurance Swim',
        detail: '2,000m — Aerobic base sets',
        duration: '45 min',
        type: 'Endurance',
        done: true,
      },
      {
        id: 's2',
        sport: 'bike',
        title: 'Long Ride',
        detail: '80km — Zone 2 steady',
        duration: '2h 30m',
        type: 'Endurance',
        done: true,
      },
      {
        id: 's3',
        sport: 'run',
        title: 'Brick Run',
        detail: '5km off the bike — easy pace',
        duration: '28 min',
        type: 'Brick',
        done: false,
      },
      {
        id: 's4',
        sport: 'swim',
        title: 'Speed Work',
        detail: '1,500m — Intervals 4×200m',
        duration: '35 min',
        type: 'Intervals',
        done: false,
      },
      {
        id: 's5',
        sport: 'run',
        title: 'Tempo Run',
        detail: '8km at threshold pace',
        duration: '38 min',
        type: 'Tempo',
        done: false,
      },
      {
        id: 's6',
        sport: 'bike',
        title: 'Recovery Spin',
        detail: '40km — Easy Zone 1',
        duration: '1h 10m',
        type: 'Recovery',
        done: false,
      },
    ],
  },
];

export const TODAY_SESSIONS: Session[] = [
  {
    id: 's3',
    sport: 'swim',
    title: 'Morning Swim',
    detail: '2,000m — Endurance sets',
    duration: '45 min',
    type: 'Endurance',
    done: false,
  },
  {
    id: 's4',
    sport: 'run',
    title: 'Brick Run',
    detail: '5km off the bike — easy pace',
    duration: '28 min',
    type: 'Brick',
    done: false,
  },
];

export const EVENTS_DATA: Event[] = [
  {
    id: 1,
    name: 'Ironman 70.3 Kyiv',
    sport: 'tri',
    dist: '70.3 mi',
    location: 'Kyiv',
    date: '2025-06-15',
    days: 80,
    fav: true,
    global: true,
  },
  {
    id: 2,
    name: 'Kyiv Half Marathon',
    sport: 'run',
    dist: '21.1 km',
    location: 'Kyiv',
    date: '2025-04-13',
    days: 17,
    fav: false,
    global: true,
  },
  {
    id: 3,
    name: 'Lviv Gran Fondo',
    sport: 'bike',
    dist: '120 km',
    location: 'Lviv',
    date: '2025-05-04',
    days: 38,
    fav: false,
    global: true,
  },
  {
    id: 4,
    name: 'Open Water Swim Dnipro',
    sport: 'swim',
    dist: '5 km',
    location: 'Dnipro',
    date: '2025-07-19',
    days: 114,
    fav: false,
    global: true,
  },
  {
    id: 5,
    name: 'Odesa Sprint Tri',
    sport: 'tri',
    dist: 'Sprint',
    location: 'Odesa',
    date: '2025-08-10',
    days: 136,
    fav: false,
    global: true,
  },
  {
    id: 6,
    name: 'Kharkiv Night Run 10K',
    sport: 'run',
    dist: '10 km',
    location: 'Kharkiv',
    date: '2025-05-24',
    days: 58,
    fav: false,
    global: true,
  },
  {
    id: 7,
    name: 'My Training Duathlon',
    sport: 'tri',
    dist: 'Custom',
    location: 'Kyiv',
    date: '2025-04-20',
    days: 24,
    fav: false,
    global: false,
  },
];

export const TOOLS: Tool[] = [
  {
    id: 'pace',
    nameKey: 'tool_pace',
    descKey: 'tool_pace_desc',
    sport: 'run',
    icon: '⏱',
    tag: 'Run',
  },
  {
    id: 'predict',
    nameKey: 'tool_predict',
    descKey: 'tool_predict_desc',
    sport: 'run',
    icon: '📈',
    tag: 'Run',
  },
  {
    id: 'cadence',
    nameKey: 'tool_cadence',
    descKey: 'tool_cadence_desc',
    sport: 'all',
    icon: '🎵',
    tag: 'All',
  },
  {
    id: 'power',
    nameKey: 'tool_power',
    descKey: 'tool_power_desc',
    sport: 'bike',
    icon: '⚡',
    tag: 'Bike',
  },
  {
    id: 'speed',
    nameKey: 'tool_speed',
    descKey: 'tool_speed_desc',
    sport: 'bike',
    icon: '🚴',
    tag: 'Bike',
  },
  { id: 'hr', nameKey: 'tool_hr', descKey: 'tool_hr_desc', sport: 'all', icon: '❤️', tag: 'All' },
  {
    id: 'calorie',
    nameKey: 'tool_calorie',
    descKey: 'tool_calorie_desc',
    sport: 'all',
    icon: '🔥',
    tag: 'All',
  },
  {
    id: 'swolf',
    nameKey: 'tool_swolf',
    descKey: 'tool_swolf_desc',
    sport: 'swim',
    icon: '🏊',
    tag: 'Swim',
  },
  {
    id: 'pool',
    nameKey: 'tool_pool',
    descKey: 'tool_pool_desc',
    sport: 'swim',
    icon: '🏁',
    tag: 'Swim',
  },
  {
    id: 'wetsuit',
    nameKey: 'tool_wetsuit',
    descKey: 'tool_wetsuit_desc',
    sport: 'swim',
    icon: '🌡️',
    tag: 'Swim',
  },
  {
    id: 'split',
    nameKey: 'tool_split',
    descKey: 'tool_split_desc',
    sport: 'tri',
    icon: '🔱',
    tag: 'Tri',
  },
  {
    id: 'nutrition',
    nameKey: 'tool_nutrition',
    descKey: 'tool_nutrition_desc',
    sport: 'tri',
    icon: '🍌',
    tag: 'Tri',
  },
  {
    id: 'transition',
    nameKey: 'tool_transition',
    descKey: 'tool_transition_desc',
    sport: 'tri',
    icon: '🔄',
    tag: 'Tri',
  },
  {
    id: 'checklist',
    nameKey: 'tool_checklist',
    descKey: 'tool_checklist_desc',
    sport: 'tri',
    icon: '✅',
    tag: 'Tri',
  },
  {
    id: 'taper',
    nameKey: 'tool_taper',
    descKey: 'tool_taper_desc',
    sport: 'tri',
    icon: '📉',
    tag: 'Tri',
  },
];
