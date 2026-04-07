import AsyncStorage from '@react-native-async-storage/async-storage';

export const Storage = {
  async get<T>(key: string): Promise<T | null> {
    const v = await AsyncStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : null;
  },
  async set(key: string, value: unknown): Promise<void> {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  },
  async remove(key: string): Promise<void> {
    await AsyncStorage.removeItem(key);
  },
};

export const STORAGE_KEYS = {
  profile: 'sportik_profile',
  onboarded: 'sportik_onboarded',
  lang: 'sportik_lang',
  isDark: 'sportik_dark',
  favs: 'sportik_favs',
  personalEvents: 'sportik_personal_events',
  doneSessions: 'sportik_done_sessions',
  prHistory: 'sportik_pr_history',
} as const;
