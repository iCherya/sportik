const DARK = {
  bg: '#0D0D0F',
  surface: '#141416',
  card: '#1C1C1F',
  cardHi: '#222226',
  border: '#2A2A2E',
  borderSub: '#1E1E22',
  text: '#F0F0EE',
  textMid: '#9090A0',
  textDim: '#505060',
  swim: '#3B9EFF',
  swimBg: '#0F2540',
  bike: '#FF8B3B',
  bikeBg: '#2A1800',
  run: '#3BCC7A',
  runBg: '#0A2018',
  tri: '#B57BFF',
  triBg: '#1A0D2E',
  heart: '#FF4F6A',
  accent: '#E8FF47',
} as const;

const LIGHT = {
  bg: '#F2F2F0',
  surface: '#E8E8E6',
  card: '#FFFFFF',
  cardHi: '#F5F5F3',
  border: '#E0E0DC',
  borderSub: '#EBEBEA',
  text: '#0F0F10',
  textMid: '#6E6E7A',
  textDim: '#ADADB8',
  swim: '#3B9EFF',
  swimBg: '#E8F4FF',
  bike: '#FF8B3B',
  bikeBg: '#FFF3E8',
  run: '#3BCC7A',
  runBg: '#E8FFF0',
  tri: '#B57BFF',
  triBg: '#F5EEFF',
  heart: '#FF4F6A',
  accent: '#E8FF47',
} as const;

export type ColorPalette = typeof DARK;

export const getColors = (isDark: boolean): ColorPalette => (isDark ? DARK : LIGHT) as ColorPalette;

// Static fallback (dark) — used in StyleSheet outside component context (makeStyles pattern)
export const Colors: ColorPalette = DARK;

export const Sports = {
  all: { color: DARK.accent, bg: '#1a1a0a', icon: '⚡', label: 'All' },
  swim: { color: DARK.swim, bg: DARK.swimBg, icon: '🏊', label: 'Swim' },
  bike: { color: DARK.bike, bg: DARK.bikeBg, icon: '🚴', label: 'Bike' },
  run: { color: DARK.run, bg: DARK.runBg, icon: '🏃', label: 'Run' },
  tri: { color: DARK.tri, bg: DARK.triBg, icon: '🔱', label: 'Tri' },
} as const;

export type SportKey = keyof typeof Sports;

export const Font = {
  condensed: 'BarlowCondensed',
  condensedBold: 'BarlowCondensedBold',
  condensedBlack: 'BarlowCondensedBlack',
  body: 'Barlow',
  bodyMedium: 'BarlowMedium',
  bodySemiBold: 'BarlowSemiBold',
} as const;

export const Space = {
  screen: 20,
  card: 18,
  radius: { sm: 10, md: 14, lg: 18, xl: 22, card: 20, overlay: 28 },
} as const;
