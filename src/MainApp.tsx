import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Lang } from './context/LangContext';
import { EVENTS_DATA, type Event } from './data';
import { STORAGE_KEYS, Storage } from './storage';
import { Colors } from './theme';
import type { OverlayType, Profile, Screen } from './types';

type Props = {
  isDark: boolean;
  setIsDark: (v: boolean) => void;
  lang: Lang;
  setLang: (v: Lang) => void;
  profile: Profile;
  setProfile: (p: Profile) => void;
};

const NAV_ORDER: Screen[] = ['home', 'tools', 'events', 'account'];
const NAV_ICONS: Record<Screen, string> = {
  home: '🏠',
  tools: '🛠',
  events: '📅',
  account: '👤',
};

// Props are passed to child screens in Phase 4 — unused in placeholder render
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function MainApp({ isDark, setIsDark, lang, setLang, profile, setProfile }: Props) {
  const [screen, setScreen] = useState<Screen>('home');
  const [_overlay, setOverlay] = useState<OverlayType | null>(null);
  const [favs, setFavs] = useState<number[]>([1]);
  const [personalEvents, setPersonalEvents] = useState<Event[]>([EVENTS_DATA[6]]);
  const [doneSessions, setDoneSessions] = useState<Record<string, boolean>>({});
  const [_qi, _setQi] = useState(0);
  const mounted = useRef(false);

  // Load persisted state on mount
  useEffect(() => {
    Promise.all([
      Storage.get<number[]>(STORAGE_KEYS.favs),
      Storage.get<Event[]>(STORAGE_KEYS.personalEvents),
      Storage.get<Record<string, boolean>>(STORAGE_KEYS.doneSessions),
    ]).then(([savedFavs, savedPersonal, savedDone]) => {
      if (savedFavs) setFavs(savedFavs);
      if (savedPersonal) setPersonalEvents(savedPersonal);
      if (savedDone) setDoneSessions(savedDone);
      mounted.current = true;
    });
  }, []);

  // Persist shared state on change (skip first render — data was just loaded)
  useEffect(() => {
    if (!mounted.current) return;
    Storage.set(STORAGE_KEYS.favs, favs);
  }, [favs]);

  useEffect(() => {
    if (!mounted.current) return;
    Storage.set(STORAGE_KEYS.personalEvents, personalEvents);
  }, [personalEvents]);

  useEffect(() => {
    if (!mounted.current) return;
    Storage.set(STORAGE_KEYS.doneSessions, doneSessions);
  }, [doneSessions]);

  // Derived: nearest upcoming favourited event
  const allEvents = [...EVENTS_DATA.filter((e) => e.global), ...personalEvents];
  const _nextRace =
    allEvents.filter((e) => favs.includes(e.id) && e.days > 0).sort((a, b) => a.days - b.days)[0] ??
    null;

  // Derived: live date string
  const _dateStr = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  // Derived: greeting
  const hour = new Date().getHours();
  const _greeting = hour < 12 ? 'Morning' : hour < 17 ? 'Afternoon' : 'Evening';

  const navigateTo = (id: Screen) => {
    setScreen(id);
    setOverlay(null);
  };

  return (
    <View style={styles.container}>
      {/* Screen area — replaced with real screens in Phase 4 */}
      <View style={styles.screen}>
        <Text style={styles.placeholder}>{screen.toUpperCase()}</Text>
        <Text style={styles.sub}>Screen coming in Phase 4</Text>
      </View>

      {/* Bottom nav — replaced with BottomNav component in Phase 3 */}
      <View style={styles.nav}>
        {NAV_ORDER.map((s) => (
          <Pressable key={s} style={styles.navItem} onPress={() => navigateTo(s)}>
            <Text style={styles.navIcon}>{NAV_ICONS[s]}</Text>
            <Text style={[styles.navLabel, screen === s && styles.navLabelActive]}>{s}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    color: Colors.text,
    fontSize: 28,
    letterSpacing: 4,
  },
  sub: {
    color: Colors.textDim,
    fontSize: 12,
    marginTop: 8,
  },
  nav: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingBottom: 20,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 4,
  },
  navIcon: {
    fontSize: 20,
  },
  navLabel: {
    color: Colors.textMid,
    fontSize: 10,
    marginTop: 3,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  navLabelActive: {
    color: Colors.accent,
  },
});
