import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { AppText } from '../components/AppText';
import { useColors } from '../context/ThemeContext';
import { type ColorPalette, Sports } from '../theme';

type RaceType = 'sprint' | 'olympic' | '70.3' | 'ironman';

type WeekPlan = { s: number; b: number; r: number };

const TAPER_DATA: Record<RaceType, { weeks: number; base: WeekPlan[] }> = {
  sprint: {
    weeks: 2,
    base: [
      { s: 100, b: 100, r: 100 },
      { s: 70, b: 70, r: 70 },
      { s: 100, b: 100, r: 100 },
    ],
  },
  olympic: {
    weeks: 3,
    base: [
      { s: 100, b: 100, r: 100 },
      { s: 80, b: 80, r: 80 },
      { s: 60, b: 60, r: 60 },
      { s: 100, b: 100, r: 100 },
    ],
  },
  '70.3': {
    weeks: 3,
    base: [
      { s: 100, b: 100, r: 100 },
      { s: 85, b: 85, r: 85 },
      { s: 65, b: 65, r: 65 },
      { s: 40, b: 40, r: 40 },
      { s: 100, b: 100, r: 100 },
    ],
  },
  ironman: {
    weeks: 4,
    base: [
      { s: 100, b: 100, r: 100 },
      { s: 90, b: 90, r: 90 },
      { s: 70, b: 70, r: 70 },
      { s: 50, b: 50, r: 50 },
      { s: 30, b: 30, r: 30 },
      { s: 100, b: 100, r: 100 },
    ],
  },
};

const RACE_OPTIONS: { id: RaceType; l: string }[] = [
  { id: 'sprint', l: 'Sprint' },
  { id: 'olympic', l: 'Olympic' },
  { id: '70.3', l: '70.3' },
  { id: 'ironman', l: 'Ironman' },
];

const BARS: { k: 'swim' | 'bike' | 'run'; c: string; l: string; key: keyof WeekPlan }[] = [
  { k: 'swim', c: Sports.swim.color, l: 'Swim', key: 's' },
  { k: 'bike', c: Sports.bike.color, l: 'Bike', key: 'b' },
  { k: 'run', c: Sports.run.color, l: 'Run', key: 'r' },
];

const makeStyles = (c: ColorPalette) =>
  StyleSheet.create({
    segGroup: { flexDirection: 'row', gap: 6, marginBottom: 12 },
    segBtn: {
      flex: 1,
      paddingVertical: 8,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.card,
      alignItems: 'center',
    },
    field: { marginBottom: 14 },
    fieldLabel: { letterSpacing: 2, marginBottom: 6 },
    inputRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    input: {
      flex: 1,
      backgroundColor: c.card,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 12,
      padding: 14,
      fontFamily: 'BarlowCondensedBlack',
      fontSize: 24,
      color: c.text,
      textAlign: 'center',
    },
    unit: {
      paddingHorizontal: 10,
      paddingVertical: 12,
      backgroundColor: c.surface,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 10,
    },
    weekCard: {
      backgroundColor: c.card,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 14,
      padding: 14,
    },
    weekHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
    },
    barGroup: { flexDirection: 'row', gap: 8, height: 60 },
    barCol: { flex: 1, alignItems: 'center' },
    barTrack: {
      flex: 1,
      width: '100%',
      backgroundColor: c.surface,
      borderRadius: 4,
      overflow: 'hidden',
      justifyContent: 'flex-end',
    },
    barFill: { width: '100%', borderRadius: 4 },
  });

export function TaperCalc() {
  const colors = useColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const [raceType, setRaceType] = useState<RaceType>('olympic');
  const [weeksOut, setWeeksOut] = useState('8');

  const d = TAPER_DATA[raceType];
  const wo = parseInt(weeksOut) || 8;

  const phases = d.base
    .map((p, i) => ({
      ...p,
      label: i === d.base.length - 1 ? '🏁 Race Week' : `Week ${wo - (d.base.length - 1 - i)}`,
      isTaper: i >= d.base.length - d.weeks - 1 && i < d.base.length - 1,
      isRace: i === d.base.length - 1,
    }))
    .filter((_p, i) => wo - (d.base.length - 1 - i) > 0 || _p.isRace);

  return (
    <View>
      <View style={styles.segGroup}>
        {RACE_OPTIONS.map((r) => {
          const active = raceType === r.id;
          return (
            <Pressable
              key={r.id}
              style={[
                styles.segBtn,
                active && {
                  borderColor: Sports.tri.color,
                  backgroundColor: `${Sports.tri.color}18`,
                },
              ]}
              onPress={() => setRaceType(r.id)}>
              <AppText
                size={12}
                weight="semibold"
                color={active ? Sports.tri.color : colors.textMid}>
                {r.l}
              </AppText>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.field}>
        <AppText
          style={styles.fieldLabel}
          condensed
          weight="bold"
          size={11}
          color={colors.textDim}
          uppercase>
          Weeks to Race
        </AppText>
        <View style={styles.inputRow}>
          <TextInput
            value={weeksOut}
            onChangeText={setWeeksOut}
            placeholder="8"
            placeholderTextColor={colors.textDim}
            keyboardType="numeric"
            style={styles.input}
          />
          <View style={styles.unit}>
            <AppText size={12} color={colors.textMid}>
              weeks
            </AppText>
          </View>
        </View>
      </View>

      <View style={{ gap: 8 }}>
        {phases.map((p, i) => (
          <View
            key={i}
            style={[
              styles.weekCard,
              p.isRace && {
                borderColor: `${colors.accent}66`,
                backgroundColor: `${colors.accent}08`,
              },
              p.isTaper && !p.isRace && { borderColor: `${Sports.tri.color}44` },
            ]}>
            <View style={styles.weekHeader}>
              <AppText
                condensed
                weight="bold"
                size={14}
                color={p.isRace ? colors.accent : colors.text}>
                {p.label}
              </AppText>
              <AppText
                size={13}
                weight="semibold"
                color={p.isRace ? colors.accent : p.isTaper ? Sports.tri.color : colors.textMid}>
                {p.isRace ? '🏁 Race Day' : `${p.s}% volume`}
              </AppText>
            </View>
            {!p.isRace && (
              <View style={styles.barGroup}>
                {BARS.map((bar) => (
                  <View key={bar.k} style={styles.barCol}>
                    <View style={styles.barTrack}>
                      <View
                        style={[
                          styles.barFill,
                          {
                            height: `${p[bar.key]}%` as `${number}%`,
                            backgroundColor: p.isTaper ? `${bar.c}88` : `${bar.c}44`,
                            borderTopWidth: 2,
                            borderTopColor: bar.c,
                          },
                        ]}
                      />
                    </View>
                    <AppText size={9} color={bar.c} style={{ textAlign: 'center', marginTop: 2 }}>
                      {bar.l}
                    </AppText>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}
      </View>

      <AppText size={11} color={colors.textDim} style={{ textAlign: 'center', marginTop: 12 }}>
        Reduce volume, not intensity.
      </AppText>
    </View>
  );
}
