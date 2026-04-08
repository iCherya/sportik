import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '../components/AppText';
import { useColors } from '../context/ThemeContext';
import { type ColorPalette } from '../theme';

type RaceType = 'tri' | 'run' | 'bike';

type CheckItem = { id: string; cat: string; text: string };

const ALL_ITEMS: Record<RaceType, CheckItem[]> = {
  tri: [
    { id: 'wetsuit', cat: 'Swim', text: 'Wetsuit' },
    { id: 'goggles', cat: 'Swim', text: 'Goggles + spare' },
    { id: 'cap', cat: 'Swim', text: 'Swim cap' },
    { id: 'helmet', cat: 'Bike', text: 'Helmet — buckled' },
    { id: 'bike', cat: 'Bike', text: 'Bike race-ready' },
    { id: 'bottles', cat: 'Bike', text: 'Bottles filled' },
    { id: 'shoes-r', cat: 'Run', text: 'Running shoes' },
    { id: 'belt', cat: 'Run', text: 'Number belt' },
    { id: 'gels', cat: 'Nutrition', text: 'Gels / chews' },
    { id: 'timing', cat: 'General', text: 'Timing chip' },
  ],
  run: [
    { id: 'shoes', cat: 'Gear', text: 'Running shoes' },
    { id: 'bib', cat: 'Gear', text: 'Race bib' },
    { id: 'watch', cat: 'Gear', text: 'GPS watch charged' },
    { id: 'gels-r', cat: 'Nutrition', text: 'Gels' },
  ],
  bike: [
    { id: 'helmet-b', cat: 'Safety', text: 'Helmet buckled' },
    { id: 'tires', cat: 'Gear', text: 'Tires pumped' },
    { id: 'bottles-b', cat: 'Nutrition', text: 'Bottles filled' },
  ],
};

const RACE_OPTIONS: { id: RaceType; l: string }[] = [
  { id: 'tri', l: '🔱 Tri' },
  { id: 'run', l: '🏃 Run' },
  { id: 'bike', l: '🚴 Bike' },
];

const makeStyles = (c: ColorPalette) =>
  StyleSheet.create({
    segGroup: { flexDirection: 'row', gap: 8, marginBottom: 12 },
    segBtn: {
      flex: 1,
      paddingVertical: 9,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.card,
      alignItems: 'center',
    },
    progressRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      marginBottom: 14,
    },
    progressBg: {
      flex: 1,
      height: 4,
      backgroundColor: c.surface,
      borderRadius: 2,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      backgroundColor: c.accent,
      borderRadius: 2,
    },
    listCard: {
      backgroundColor: c.card,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 16,
      overflow: 'hidden',
    },
    catHeader: {
      paddingHorizontal: 16,
      paddingTop: 12,
      paddingBottom: 4,
      backgroundColor: c.surface,
    },
    checkRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
      paddingVertical: 13,
      paddingHorizontal: 16,
      borderTopWidth: 1,
      borderTopColor: c.borderSub,
    },
    checkbox: {
      width: 22,
      height: 22,
      borderRadius: 6,
      borderWidth: 1.5,
      borderColor: c.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

export function RaceChecklist() {
  const colors = useColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const [raceType, setRaceType] = useState<RaceType>('tri');
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const toggle = (id: string) => setChecked((c) => ({ ...c, [id]: !c[id] }));
  const items = ALL_ITEMS[raceType];
  const doneCount = items.filter((i) => checked[i.id]).length;

  // Group items by category
  const categories: string[] = [];
  items.forEach((item) => {
    if (!categories.includes(item.cat)) categories.push(item.cat);
  });

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
                active && { borderColor: colors.accent, backgroundColor: `${colors.accent}18` },
              ]}
              onPress={() => {
                setRaceType(r.id);
                setChecked({});
              }}>
              <AppText size={13} weight="semibold" color={active ? colors.accent : colors.textMid}>
                {r.l}
              </AppText>
            </Pressable>
          );
        })}
      </View>

      {/* Progress bar */}
      <View style={styles.progressRow}>
        <AppText weight="semibold" size={13} color={colors.textMid}>
          {doneCount}/{items.length}
        </AppText>
        <View style={styles.progressBg}>
          <View
            style={[
              styles.progressFill,
              { width: `${(doneCount / items.length) * 100}%` as `${number}%` },
            ]}
          />
        </View>
        <Pressable onPress={() => setChecked({})}>
          <AppText size={11} color={colors.textDim}>
            Reset
          </AppText>
        </Pressable>
      </View>

      {/* Checklist grouped by category */}
      <View style={styles.listCard}>
        {categories.map((cat) => (
          <View key={cat}>
            <View style={styles.catHeader}>
              <AppText
                condensed
                weight="bold"
                size={10}
                color={colors.textDim}
                uppercase
                style={{ letterSpacing: 1.5 }}>
                {cat}
              </AppText>
            </View>
            {items
              .filter((item) => item.cat === cat)
              .map((item) => {
                const done = !!checked[item.id];
                return (
                  <Pressable key={item.id} style={styles.checkRow} onPress={() => toggle(item.id)}>
                    <View
                      style={[
                        styles.checkbox,
                        done && { backgroundColor: colors.accent, borderColor: colors.accent },
                      ]}>
                      {done && (
                        <AppText size={13} color="#000">
                          ✓
                        </AppText>
                      )}
                    </View>
                    <AppText
                      weight="medium"
                      size={14}
                      color={done ? colors.textDim : colors.text}
                      style={{ textDecorationLine: done ? 'line-through' : 'none' }}>
                      {item.text}
                    </AppText>
                  </Pressable>
                );
              })}
          </View>
        ))}
      </View>
    </View>
  );
}
