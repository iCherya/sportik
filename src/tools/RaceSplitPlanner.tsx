import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { AppText } from '../components/AppText';
import { Colors } from '../theme';

type DistKey = 'sprint' | 'olympic' | '70.3' | 'ironman';

const DISTS: Record<DistKey, { swim: number; bike: number; run: number; label: string }> = {
  sprint: { swim: 0.75, bike: 20, run: 5, label: 'Sprint' },
  olympic: { swim: 1.5, bike: 40, run: 10, label: 'Olympic' },
  '70.3': { swim: 1.9, bike: 90, run: 21.1, label: '70.3' },
  ironman: { swim: 3.8, bike: 180, run: 42.2, label: 'Ironman' },
};

const SPLITS = [
  { leg: 'Swim', icon: '🏊', color: Colors.swim, pct: 0.13 },
  { leg: 'T1', icon: '🔄', color: Colors.textMid, pct: 0.02 },
  { leg: 'Bike', icon: '🚴', color: Colors.bike, pct: 0.51 },
  { leg: 'T2', icon: '🔄', color: Colors.textMid, pct: 0.015 },
  { leg: 'Run', icon: '🏃', color: Colors.run, pct: 0.335 },
];

const fmt = (s: number) =>
  s < 3600
    ? `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}`
    : `${Math.floor(s / 3600)}h ${Math.floor((s % 3600) / 60)}m`;

export function RaceSplitPlanner() {
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
                active && { borderColor: Colors.tri, backgroundColor: `${Colors.tri}18` },
              ]}
              onPress={() => setDist(k)}>
              <AppText size={12} weight="semibold" color={active ? Colors.tri : Colors.textMid}>
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
          color={Colors.textDim}
          uppercase>
          Target Time
        </AppText>
        <View style={styles.inputRow}>
          <TextInput
            value={total}
            onChangeText={setTotal}
            placeholder="4"
            placeholderTextColor={Colors.textDim}
            keyboardType="numeric"
            style={[styles.input, { flex: 1 }]}
          />
          <View style={styles.unit}>
            <AppText size={12} color={Colors.textMid}>
              h
            </AppText>
          </View>
          <TextInput
            value={totM}
            onChangeText={setTotM}
            placeholder="38"
            placeholderTextColor={Colors.textDim}
            keyboardType="numeric"
            style={[styles.input, { flex: 1 }]}
          />
          <View style={styles.unit}>
            <AppText size={12} color={Colors.textMid}>
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
                  borderBottomColor: Colors.borderSub,
                },
              ]}>
              <AppText size={18} style={{ width: 28 }}>
                {sp.icon}
              </AppText>
              <View style={{ flex: 1 }}>
                <AppText weight="semibold" size={14}>
                  {sp.leg}
                </AppText>
                <AppText size={11} color={Colors.textDim}>
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

const styles = StyleSheet.create({
  segGroup: { flexDirection: 'row', gap: 6, marginBottom: 16 },
  segBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.card,
    alignItems: 'center',
  },
  field: { marginBottom: 14 },
  fieldLabel: { letterSpacing: 2, marginBottom: 6 },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  input: {
    flex: 1,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 14,
    fontFamily: 'BarlowCondensedBlack',
    fontSize: 24,
    color: Colors.text,
    textAlign: 'center',
  },
  unit: {
    paddingHorizontal: 10,
    paddingVertical: 12,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
  },
  splitsCard: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
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
