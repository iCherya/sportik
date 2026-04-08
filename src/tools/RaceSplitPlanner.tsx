import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { AppText } from '../components/AppText';
import { useColors } from '../context/ThemeContext';
import { type ColorPalette, Sports } from '../theme';

type DistKey = 'sprint' | 'olympic' | '70.3' | 'ironman';

const DISTS: Record<DistKey, { swim: number; bike: number; run: number; label: string }> = {
  sprint: { swim: 0.75, bike: 20, run: 5, label: 'Sprint' },
  olympic: { swim: 1.5, bike: 40, run: 10, label: 'Olympic' },
  '70.3': { swim: 1.9, bike: 90, run: 21.1, label: '70.3' },
  ironman: { swim: 3.8, bike: 180, run: 42.2, label: 'Ironman' },
};

const SPLITS = [
  { leg: 'Swim', icon: '🏊', color: Sports.swim.color, pct: 0.13 },
  { leg: 'T1', icon: '🔄', color: '#6E6E7A', pct: 0.02 },
  { leg: 'Bike', icon: '🚴', color: Sports.bike.color, pct: 0.51 },
  { leg: 'T2', icon: '🔄', color: '#6E6E7A', pct: 0.015 },
  { leg: 'Run', icon: '🏃', color: Sports.run.color, pct: 0.335 },
];

const fmt = (s: number) =>
  s < 3600
    ? `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}`
    : `${Math.floor(s / 3600)}h ${Math.floor((s % 3600) / 60)}m`;

const makeStyles = (c: ColorPalette) =>
  StyleSheet.create({
    segGroup: { flexDirection: 'row', gap: 6, marginBottom: 16 },
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
    splitsCard: {
      backgroundColor: c.card,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 16,
      overflow: 'hidden',
    },
    splitRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingVertical: 13,
      paddingHorizontal: 16,
    },
  });

export function RaceSplitPlanner() {
  const colors = useColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const [total, setTotal] = useState('4');
  const [totM, setTotM] = useState('38');
  const [dist, setDist] = useState<DistKey>('olympic');

  const d = DISTS[dist];
  const totalSec = (parseInt(total) || 0) * 3600 + (parseInt(totM) || 0) * 60;

  const distLabels: Record<string, string> = {
    Swim: `${d.swim}km`,
    Bike: `${d.bike}km`,
    Run: `${d.run}km`,
    T1: 'T1',
    T2: 'T2',
  };

  return (
    <View>
      <View style={styles.segGroup}>
        {(Object.keys(DISTS) as DistKey[]).map((k) => {
          const active = dist === k;
          return (
            <Pressable
              key={k}
              style={[
                styles.segBtn,
                active && {
                  borderColor: Sports.tri.color,
                  backgroundColor: `${Sports.tri.color}18`,
                },
              ]}
              onPress={() => setDist(k)}>
              <AppText
                size={12}
                weight="semibold"
                color={active ? Sports.tri.color : colors.textMid}>
                {DISTS[k].label}
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
          Target Time
        </AppText>
        <View style={styles.inputRow}>
          <TextInput
            value={total}
            onChangeText={setTotal}
            placeholder="4"
            placeholderTextColor={colors.textDim}
            keyboardType="numeric"
            style={[styles.input, { flex: 1 }]}
          />
          <View style={styles.unit}>
            <AppText size={12} color={colors.textMid}>
              h
            </AppText>
          </View>
          <TextInput
            value={totM}
            onChangeText={setTotM}
            placeholder="38"
            placeholderTextColor={colors.textDim}
            keyboardType="numeric"
            style={[styles.input, { flex: 1 }]}
          />
          <View style={styles.unit}>
            <AppText size={12} color={colors.textMid}>
              m
            </AppText>
          </View>
        </View>
      </View>

      <View style={styles.splitsCard}>
        {SPLITS.map((sp, i) => {
          const ls = totalSec * sp.pct;
          return (
            <View
              key={sp.leg}
              style={[
                styles.splitRow,
                i < SPLITS.length - 1 && {
                  borderBottomWidth: 1,
                  borderBottomColor: colors.borderSub,
                },
              ]}>
              <AppText size={18} style={{ width: 28 }}>
                {sp.icon}
              </AppText>
              <View style={{ flex: 1 }}>
                <AppText weight="semibold" size={14}>
                  {sp.leg}
                </AppText>
                <AppText size={11} color={colors.textDim}>
                  {distLabels[sp.leg]}
                </AppText>
              </View>
              <AppText condensed weight="black" size={18} color={sp.color}>
                {totalSec > 0 ? fmt(ls) : '--'}
              </AppText>
            </View>
          );
        })}
      </View>
    </View>
  );
}
