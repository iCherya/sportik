import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

import type { Lang } from '../src/context/LangContext';
import { LangContext } from '../src/context/LangContext';
import { ThemeContext } from '../src/context/ThemeContext';
import { MainApp } from '../src/MainApp';
import type { OBData } from '../src/onboarding/Onboarding';
import { Onboarding } from '../src/onboarding/Onboarding';
import { STORAGE_KEYS, Storage } from '../src/storage';
import { Colors } from '../src/theme';
import type { Profile } from '../src/types';

const DEFAULT_PROFILE: Profile = {
  name: 'Athlete',
  city: '',
  focus: 'Triathlete',
  avatar: '🧑',
  sports: [],
  raceType: '',
  raceDate: '',
  maxHR: '',
  ftp: '',
  hoursPerWeek: 8,
};

export default function Index() {
  const [isDark, setIsDark] = useState(true);
  const [lang, setLang] = useState<Lang>('en');
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
  const [onboarded, setOnboarded] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      Storage.get<boolean>(STORAGE_KEYS.isDark),
      Storage.get<Lang>(STORAGE_KEYS.lang),
      Storage.get<Profile>(STORAGE_KEYS.profile),
      Storage.get<boolean>(STORAGE_KEYS.onboarded),
    ]).then(([dark, savedLang, savedProfile, savedOnboarded]) => {
      if (dark !== null) setIsDark(dark);
      if (savedLang) setLang(savedLang);
      if (savedProfile) setProfile(savedProfile);
      if (savedOnboarded) setOnboarded(true);
      setLoading(false);
    });
  }, []);

  const handleSetProfile = (p: Profile) => {
    Storage.set(STORAGE_KEYS.profile, p);
    setProfile(p);
  };

  const handleOnboardingComplete = (data: OBData) => {
    const p: Profile = {
      ...DEFAULT_PROFILE,
      name: data.name || (lang === 'uk' ? 'Атлет' : 'Athlete'),
      sports: data.sports,
      raceType: data.raceType,
      raceDate: data.raceDate,
      maxHR: data.maxHR,
      ftp: data.ftp,
    };
    Storage.set(STORAGE_KEYS.profile, p);
    Storage.set(STORAGE_KEYS.onboarded, true);
    setProfile(p);
    setOnboarded(true);
  };

  const handleSkipAll = () => {
    const p = { ...DEFAULT_PROFILE, name: lang === 'uk' ? 'Атлет' : 'Athlete' };
    Storage.set(STORAGE_KEYS.profile, p);
    setProfile(p);
    Storage.set(STORAGE_KEYS.onboarded, true);
    setOnboarded(true);
  };

  const handleLogout = () => {
    setProfile(DEFAULT_PROFILE);
    setLang('en');
    setIsDark(true);
    setOnboarded(false);
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: Colors.bg,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <ActivityIndicator color={Colors.accent} />
      </View>
    );
  }

  const handleSetLang = (v: Lang) => {
    Storage.set(STORAGE_KEYS.lang, v);
    setLang(v);
  };

  if (!onboarded) {
    return (
      <ThemeContext.Provider value={isDark}>
        <LangContext.Provider value={lang}>
          <Onboarding
            onComplete={handleOnboardingComplete}
            onSkipAll={handleSkipAll}
            setLang={handleSetLang}
          />
        </LangContext.Provider>
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider value={isDark}>
      <LangContext.Provider value={lang}>
        <MainApp
          isDark={isDark}
          setIsDark={setIsDark}
          lang={lang}
          setLang={setLang}
          profile={profile}
          setProfile={handleSetProfile}
          onLogout={handleLogout}
        />
      </LangContext.Provider>
    </ThemeContext.Provider>
  );
}
