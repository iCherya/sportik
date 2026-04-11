import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { BottomNav } from './components/BottomNav';
import { LangContext } from './context/LangContext';
import type { Lang } from './context/LangContext';
import { useColors } from './context/ThemeContext';
import { EVENTS_DATA, type Event, type Tool } from './data';
import { useT } from './i18n';
import { AboutOverlay } from './overlays/AboutOverlay';
import { EditProfileOverlay } from './overlays/EditProfileOverlay';
import { HRZonesOverlay } from './overlays/HRZonesOverlay';
import { PlanOverlay } from './overlays/PlanOverlay';
import { ToolDetail } from './overlays/ToolDetail';
import { AccountScreen } from './screens/AccountScreen';
import { EventsScreen } from './screens/EventsScreen';
import { HomeScreen } from './screens/HomeScreen';
import { ToolsScreen } from './screens/ToolsScreen';
import { STORAGE_KEYS, Storage } from './storage';
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
  const colors = useColors();
  const t = useT();
  const [screen, setScreen] = useState<Screen>('home');
  const [overlay, setOverlay] = useState<OverlayType | null>(null);
  const [favs, setFavs] = useState<number[]>([1]);
  const [personalEvents, setPersonalEvents] = useState<Event[]>([EVENTS_DATA[6]]);
  const mounted = useRef(false);

  // Load persisted state on mount
  useEffect(() => {
    Promise.all([
      Storage.get<number[]>(STORAGE_KEYS.favs),
      Storage.get<Event[]>(STORAGE_KEYS.personalEvents),
    ]).then(([savedFavs, savedPersonal]) => {
      if (savedFavs) setFavs(savedFavs);
      if (savedPersonal) setPersonalEvents(savedPersonal);
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

  // Derived: nearest upcoming favourited event
  const allEvents = [...EVENTS_DATA.filter((e) => e.global), ...personalEvents];
  const nextRace =
    allEvents.filter((e) => favs.includes(e.id) && e.days > 0).sort((a, b) => a.days - b.days)[0] ??
    null;

  // Derived: live date string — locale follows language setting
  const dateStr = new Date().toLocaleDateString(lang === 'uk' ? 'uk-UA' : 'en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  // Derived: greeting
  const hour = new Date().getHours();
  const greeting =
    hour < 12
      ? t('home_greeting_morning')
      : hour < 17
        ? t('home_greeting_afternoon')
        : t('home_greeting_evening');

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

  const renderOverlay = () => {
    if (!overlay) return null;
    const close = () => setOverlay(null);

    switch (overlay.type) {
      case 'tool':
        return <ToolDetail tool={overlay.tool} onBack={close} />;
      case 'plan':
        return <PlanOverlay onBack={close} />;
      case 'about':
        return <AboutOverlay onBack={close} />;
      case 'editProfile':
        return (
          <EditProfileOverlay profile={overlay.profile} onSave={overlay.onSave} onBack={close} />
        );
      case 'hrZones':
        return (
          <HRZonesOverlay
            maxHR={overlay.maxHR}
            hrMethod={overlay.hrMethod}
            onSave={overlay.onSave}
            onBack={close}
          />
        );
    }
  };

  return (
    <LangContext.Provider value={lang}>
      <View style={[styles.container, { backgroundColor: colors.bg }]}>
        {renderScreen()}
        <BottomNav screen={screen} onNavigate={navigateTo} />
        {renderOverlay()}
      </View>
    </LangContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
