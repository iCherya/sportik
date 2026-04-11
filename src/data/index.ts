import type { LangKey } from '../i18n';
import { Sports, type SportKey } from '../theme';

/** Every concrete sport key (excludes synthetic 'all'). Derive from Sports so additions are automatic. */
export const ALL_SPORT_KEYS = Object.keys(Sports).filter((k) => k !== 'all') as SportKey[];

/** True when a tool covers every sport (shown as "All" badge). */
export function isAllSports(tool: { sports: SportKey[] }): boolean {
  return ALL_SPORT_KEYS.every((s) => tool.sports.includes(s));
}

/** Primary accent color for a tool: first sport's color, or undefined when covering all sports. */
export function toolPrimarySport(tool: { sports: [SportKey, ...SportKey[]] }) {
  return isAllSports(tool) ? null : Sports[tool.sports[0]];
}

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
  sports: [SportKey, ...SportKey[]];
  icon: string;
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

export const QUOTES: { en: string; uk: string; author: string }[] = [
  {
    en: 'The body achieves what the mind believes.',
    uk: 'Тіло досягає того, у що вірить розум.',
    author: 'Unknown',
  },
  {
    en: 'Pain is temporary. Quitting lasts forever.',
    uk: 'Біль минає. Здача — ніколи.',
    author: 'Lance Armstrong',
  },
  {
    en: 'Swim. Bike. Run. Suffer. Repeat.',
    uk: 'Плив. Їхав. Біг. Страждав. Повторюй.',
    author: 'Every Triathlete',
  },
  { en: 'Your only limit is you.', uk: 'Твоя єдина межа — ти сам.', author: 'Unknown' },
  {
    en: "Champions aren't made in gyms.",
    uk: 'Чемпіонів не виховують у спортзалах.',
    author: 'Muhammad Ali',
  },
  {
    en: 'It never gets easier. You just get stronger.',
    uk: 'Не стає легше — ти стаєш сильнішим.',
    author: 'Unknown',
  },
  {
    en: 'Run when you can, walk if you have to, crawl if you must — just never give up.',
    uk: 'Біжи якщо можеш, йди якщо треба, повзи якщо мусиш — але не здавайся.',
    author: 'Dean Karnazes',
  },
  {
    en: 'Endurance is not just the ability to bear a hard thing, but to turn it into glory.',
    uk: 'Витривалість — це не лише здатність терпіти важке, а й перетворювати його на тріумф.',
    author: 'William Barclay',
  },
  {
    en: "The miracle isn't that I finished. The miracle is that I had the courage to start.",
    uk: 'Диво не в тому, що я фінішував. Диво — що я мав сміливість почати.',
    author: 'John Bingham',
  },
  {
    en: "You don't have to be fast. But you'd better be fearless.",
    uk: 'Не треба бути швидким. Треба бути безстрашним.',
    author: 'Kim Collins',
  },
  {
    en: 'Somewhere someone is training when you are not. When you race them, they will win.',
    uk: 'Десь у світі хтось тренується, поки ти відпочиваєш. На змаганнях він переможе.',
    author: 'Tom Fleming',
  },
  { en: 'Life is short. Run hard.', uk: 'Життя коротке. Біжи сильніше.', author: 'Unknown' },
  {
    en: 'A river cuts through rock not because of its power, but because of its persistence.',
    uk: 'Річка прорізає скелю не силою, а наполегливістю.',
    author: 'Unknown',
  },
  {
    en: "To finish a triathlon is to silence every voice that ever said you couldn't.",
    uk: 'Фінішувати тріатлон — значить заглушити всіх, хто казав, що ти не зможеш.',
    author: 'Unknown',
  },
  {
    en: 'First, train your mind. The body will follow.',
    uk: 'Спочатку тренуй розум. Тіло піде слідом.',
    author: 'Unknown',
  },
  { en: 'Every mile is a gift.', uk: 'Кожна миля — це подарунок.', author: 'Unknown' },
  {
    en: 'Push harder than yesterday if you want a different tomorrow.',
    uk: 'Штовхай сильніше, ніж вчора — якщо хочеш іншого завтра.',
    author: 'Unknown',
  },
  {
    en: 'The best pace is a suicide pace, and today looks good to die.',
    uk: 'Найкращий темп — самогубний темп, а сьогодні — гарний день для цього.',
    author: 'Steve Prefontaine',
  },
  {
    en: 'You are one workout away from a good mood.',
    uk: 'Одне тренування відокремлює тебе від гарного настрою.',
    author: 'Unknown',
  },
  {
    en: 'Hills are just opportunities in disguise.',
    uk: 'Підйоми — це можливості в масці.',
    author: 'Unknown',
  },
  {
    en: "Your body can stand almost anything. It's your mind you have to convince.",
    uk: 'Твоє тіло витримає майже все. Переконати треба лише розум.',
    author: 'Unknown',
  },
  {
    en: 'One more lap. One more mile. One more reason to keep going.',
    uk: 'Ще одне коло. Ще одна миля. Ще одна причина йти далі.',
    author: 'Unknown',
  },
  {
    en: 'The road to the finish line is paved with consistency.',
    uk: 'Шлях до фінішу вимощений постійністю.',
    author: 'Unknown',
  },
  {
    en: "Don't dream of winning. Train for it.",
    uk: 'Не мрій про перемогу. Тренуйся заради неї.',
    author: 'Mo Farah',
  },
  {
    en: "Hard work beats talent when talent doesn't work hard.",
    uk: 'Наполеглива праця перемагає талант, коли талант не працює.',
    author: 'Tim Notke',
  },
  {
    en: 'Suffer now and live the rest of your life as a champion.',
    uk: 'Страждай зараз — і решту життя живи як чемпіон.',
    author: 'Muhammad Ali',
  },
  { en: 'Breathe. Believe. Battle.', uk: 'Дихай. Вір. Борись.', author: 'Unknown' },
  {
    en: "The swim is not about the distance, the bike is not about the miles — it's all about the will.",
    uk: 'Плавання — не про дистанцію, велосипед — не про кілометри. Все це — про силу волі.',
    author: 'Unknown',
  },
  {
    en: "Fatigue is just your body's way of asking if you really want it.",
    uk: 'Втома — це лише спосіб тіла запитати, чи справді ти цього хочеш.',
    author: 'Unknown',
  },
  {
    en: 'You trained for this. Now go prove it.',
    uk: 'Ти тренувався для цього. Тепер доведи це.',
    author: 'Unknown',
  },
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
  { id: 'pace', nameKey: 'tool_pace', descKey: 'tool_pace_desc', sports: ['run'], icon: '⏱' },
  {
    id: 'predict',
    nameKey: 'tool_predict',
    descKey: 'tool_predict_desc',
    sports: ['run'],
    icon: '📈',
  },
  {
    id: 'cadence',
    nameKey: 'tool_cadence',
    descKey: 'tool_cadence_desc',
    sports: ['run', 'bike'],
    icon: '🎵',
  },
  { id: 'power', nameKey: 'tool_power', descKey: 'tool_power_desc', sports: ['bike'], icon: '⚡' },
  { id: 'speed', nameKey: 'tool_speed', descKey: 'tool_speed_desc', sports: ['bike'], icon: '🚴' },
  {
    id: 'hr',
    nameKey: 'tool_hr',
    descKey: 'tool_hr_desc',
    sports: ['run', 'bike', 'swim', 'tri'],
    icon: '❤️',
  },
  {
    id: 'calorie',
    nameKey: 'tool_calorie',
    descKey: 'tool_calorie_desc',
    sports: ['run', 'bike', 'swim', 'tri'],
    icon: '🔥',
  },
  { id: 'swolf', nameKey: 'tool_swolf', descKey: 'tool_swolf_desc', sports: ['swim'], icon: '🏊' },
  { id: 'pool', nameKey: 'tool_pool', descKey: 'tool_pool_desc', sports: ['swim'], icon: '🏁' },
  {
    id: 'wetsuit',
    nameKey: 'tool_wetsuit',
    descKey: 'tool_wetsuit_desc',
    sports: ['swim'],
    icon: '🌡️',
  },
  { id: 'split', nameKey: 'tool_split', descKey: 'tool_split_desc', sports: ['tri'], icon: '🔱' },
  {
    id: 'nutrition',
    nameKey: 'tool_nutrition',
    descKey: 'tool_nutrition_desc',
    sports: ['tri'],
    icon: '🍌',
  },
  {
    id: 'transition',
    nameKey: 'tool_transition',
    descKey: 'tool_transition_desc',
    sports: ['tri'],
    icon: '🔄',
  },
  {
    id: 'checklist',
    nameKey: 'tool_checklist',
    descKey: 'tool_checklist_desc',
    sports: ['tri'],
    icon: '✅',
  },
  { id: 'taper', nameKey: 'tool_taper', descKey: 'tool_taper_desc', sports: ['tri'], icon: '📉' },
];
