import type { Tool } from './data';

export type Screen = 'home' | 'tools' | 'events' | 'account';

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

export type PRData = {
  sport: string;
  label: string;
  val: string;
};

export type OverlayType =
  | { type: 'tool'; tool: Tool }
  | { type: 'pr'; pr: PRData }
  | { type: 'plan' }
  | { type: 'about' }
  | { type: 'editProfile'; profile: Profile; onSave: (p: Profile) => void }
  | { type: 'hrZones'; maxHR: string; hrMethod: string; onSave: (v: unknown) => void };
