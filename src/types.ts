import type { Tool } from './data';

export type Screen = 'home' | 'tools' | 'events' | 'account';
export const NAV_ORDER: Screen[] = ['home', 'tools', 'events', 'account'];

export type Profile = {
  name: string;
  city: string;
  focus: string;
  avatar: string;
  sports: string[];
  raceType: string;
  raceDate: string;
  maxHR: string;
  ftp: string;
  hoursPerWeek: number;
};

export type OverlayType =
  | { type: 'tool'; tool: Tool }
  | { type: 'plan' }
  | { type: 'about' }
  | { type: 'editProfile'; profile: Profile; onSave: (p: Profile) => void }
  | { type: 'hrZones'; maxHR: string; hrMethod: string; onSave: (v: unknown) => void };
