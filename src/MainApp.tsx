import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from './components/AppText';
import { BottomNav } from './components/BottomNav';
import type { Lang } from './context/LangContext';
import { EVENTS_DATA, type Event, type Tool } from './data';
import { AccountScreen } from './screens/AccountScreen';
import { EventsScreen } from './screens/EventsScreen';
import { HomeScreen } from './screens/HomeScreen';
import { ToolsScreen } from './screens/ToolsScreen';
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

export function MainApp({ isDark, setIsDark, lang, setLang, profile, setProfile }: Props) {
  const [screen, setScreen] = useState<Screen>('home');
  const [overlay, setOverlay] = useState<OverlayType | null>(null);
  const [favs, setFavs] = useState<number[]>([1]);
  const [personalEvents, setPersonalEvents] = useState<Event[]>([EVENTS_DATA[6]]);
  const [doneSessions, setDoneSessions] = useState<Record<string, boolean>>({});
  const [qi, setQi] = useState(0);
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
  const nextRace =
    allEvents.filter((e) => favs.includes(e.id) && e.days > 0).sort((a, b) => a.days - b.days)[0] ??
    null;

  // Derived: live date string
  const dateStr = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  // Derived: greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Morning' : hour < 17 ? 'Afternoon' : 'Evening';

  const navigateTo = (id: Screen) => {
    setScreen(id);
    setOverlay(null);
  };

  const handleOpenTool = (tool: Tool) => {
    setOverlay({ type: 'tool', tool });
  };

  const renderScreen = () => {
    switch (screen) {
      case 'home':
        return (
          <HomeScreen
            profile={profile}
            nextRace={nextRace}
            dateStr={dateStr}
            greeting={greeting}
            doneSessions={doneSessions}
            setDoneSessions={setDoneSessions}
            qi={qi}
            setQi={setQi}
            onOpenTool={handleOpenTool}
            onOpenPlan={() => setOverlay({ type: 'plan' })}
          />
        );
      case 'tools':
        return <ToolsScreen onSelect={(tool) => setOverlay({ type: 'tool', tool })} />;
      case 'events':
        return (
          <EventsScreen
            favs={favs}
            setFavs={setFavs}
            personalEvents={personalEvents}
            setPersonalEvents={setPersonalEvents}
          />
        );
      case 'account':
        return (
          <AccountScreen
            setOverlay={setOverlay}
            isDark={isDark}
            setIsDark={setIsDark}
            profile={profile}
            setProfile={setProfile}
            lang={lang}
            setLang={setLang}
          />
        );
    }
  };

  return (
    <View style={styles.container}>
      {renderScreen()}

      <BottomNav screen={screen} onNavigate={navigateTo} />

      {/* Overlay placeholder — real overlay content wired in Phase 5 */}
      {overlay &&
        overlay.type !== 'tool' &&
        overlay.type !== 'plan' &&
        overlay.type !== 'pr' &&
        overlay.type !== 'about' &&
        overlay.type !== 'editProfile' &&
        overlay.type !== 'hrZones' && <View style={styles.overlayStub} pointerEvents="box-none" />}
      {overlay && (overlay.type === 'plan' || overlay.type === 'about') && (
        <View style={[styles.overlayStub, { justifyContent: 'center', alignItems: 'center' }]}>
          <AppText condensed weight="black" size={22} color={Colors.accent}>
            {overlay.type.toUpperCase()} OVERLAY
          </AppText>
          <AppText size={12} color={Colors.textDim} style={{ marginTop: 8 }}>
            Coming in Phase 5
          </AppText>
          <Pressable onPress={() => setOverlay(null)}>
            <AppText weight="semibold" size={14} color={Colors.textMid} style={{ marginTop: 20 }}>
              ← Close
            </AppText>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  overlayStub: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.bg,
    zIndex: 80,
  },
});
