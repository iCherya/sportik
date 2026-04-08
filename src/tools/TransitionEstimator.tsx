import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '../components/AppText';
import { useColors } from '../context/ThemeContext';
import { type ColorPalette, Sports } from '../theme';

type ExpLevel = 'beginner' | 'intermediate' | 'advanced' | 'elite';

const BASE: Record<ExpLevel, { t1: number; t2: number }> = {
  beginner: { t1: 300, t2: 240 },
  intermediate: { t1: 180, t2: 150 },
  advanced: { t1: 90, t2: 75 },
  elite: { t1: 60, t2: 50 },
};

const EXP_OPTIONS: { id: ExpLevel; l: string }[] = [
  { id: 'beginner', l: 'Beginner' },
  { id: 'intermediate', l: 'Intermediate' },
  { id: 'advanced', l: 'Advanced' },
  { id: 'elite', l: 'Elite' },
];

const TIPS = [
  { text: 'Remove wetsuit', zone: 'T1' },
  { text: 'Helmet buckled', zone: 'T1' },
  { text: 'Shoes on bike', zone: 'T1' },
  { text: 'Rack bike', zone: 'T2' },
  { text: 'Switch shoes', zone: 'T2' },
  { text: 'Race belt', zone: 'T2' },
];

const fmtTime = (s: number) =>
  `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}`;

const makeStyles = (c: ColorPalette) =>
  StyleSheet.create({
    field: { marginBottom: 14 },
    fieldLabel: { letterSpacing: 2, marginBottom: 8 },
    segGroup: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    segBtn: {
      paddingVertical: 9,
      paddingHorizontal: 14,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.card,
    },
    cards: { flexDirection: 'row', gap: 8, marginBottom: 16 },
    resultCard: {
      flex: 1,
      borderWidth: 1,
      borderRadius: 14,
      padding: 12,
      alignItems: 'center',
    },
    tipsCard: {
      backgroundColor: c.card,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 16,
      overflow: 'hidden',
    },
    tipRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
  });

export function TransitionEstimator() {
  const colors = useColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const [exp, setExp] = useState<ExpLevel>('intermediate');

  const b = BASE[exp];
  const t1 = b.t1;
  const t2 = b.t2;

  const resultCards = [
    { l: 'T1', v: fmtTime(t1), c: Sports.tri.color },
    { l: 'T2', v: fmtTime(t2), c: Sports.tri.color },
    { l: 'Total', v: fmtTime(t1 + t2), c: colors.accent },
  ];

  return (
    <View>
      <View style={styles.field}>
        <AppText
          style={styles.fieldLabel}
          condensed
          weight="bold"
          size={11}
          color={colors.textDim}
          uppercase>
          Experience
        </AppText>
        <View style={styles.segGroup}>
          {EXP_OPTIONS.map((e) => {
            const active = exp === e.id;
            return (
              <Pressable
                key={e.id}
                style={[
                  styles.segBtn,
                  active && {
                    borderColor: Sports.tri.color,
                    backgroundColor: `${Sports.tri.color}18`,
                  },
                ]}
                onPress={() => setExp(e.id)}>
                <AppText
                  size={12}
                  weight="semibold"
                  color={active ? Sports.tri.color : colors.textMid}>
                  {e.l}
                </AppText>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.cards}>
        {resultCards.map((c) => (
          <View
            key={c.l}
            style={[
              styles.resultCard,
              { backgroundColor: Sports.tri.bg, borderColor: `${Sports.tri.color}33` },
            ]}>
            <AppText
              condensed
              weight="bold"
              size={10}
              color={c.c}
              uppercase
              style={{ letterSpacing: 1.5, marginBottom: 4 }}>
              {c.l}
            </AppText>
            <AppText condensed weight="black" size={28} color={c.c}>
              {c.v}
            </AppText>
          </View>
        ))}
      </View>

      <View style={styles.tipsCard}>
        {TIPS.map((tip, i) => (
          <View
            key={tip.text}
            style={[
              styles.tipRow,
              i < TIPS.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.borderSub },
            ]}>
            <AppText size={16} style={{ width: 24 }}>
              {i < 3 ? '🔵' : '🟢'}
            </AppText>
            <AppText weight="medium" size={13} style={{ flex: 1 }}>
              {tip.text}
            </AppText>
            <AppText size={11} color={colors.textDim}>
              {tip.zone}
            </AppText>
          </View>
        ))}
      </View>
    </View>
  );
}
