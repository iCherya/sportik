import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '../components/AppText';
import { useColors } from '../context/ThemeContext';
import { type LangKey, useT } from '../i18n';
import { type ColorPalette } from '../theme';

type RaceType = 'tri' | 'run' | 'bike';

type CheckItem = { id: string; catKey: LangKey; textKey: LangKey };

const ALL_ITEMS: Record<RaceType, CheckItem[]> = {
  tri: [
    { id: 'wetsuit', catKey: 'rsp_swim', textKey: 'cl_wetsuit' },
    { id: 'goggles', catKey: 'rsp_swim', textKey: 'cl_goggles' },
    { id: 'cap', catKey: 'rsp_swim', textKey: 'cl_cap' },
    { id: 'helmet', catKey: 'rsp_bike', textKey: 'cl_helmet_rack' },
    { id: 'bike', catKey: 'rsp_bike', textKey: 'cl_bike_ready' },
    { id: 'bottles', catKey: 'rsp_bike', textKey: 'cl_bottles' },
    { id: 'shoes-r', catKey: 'rsp_run', textKey: 'cl_shoes_run' },
    { id: 'belt', catKey: 'rsp_run', textKey: 'cl_belt_num' },
    { id: 'gels', catKey: 'cl_cat_nutrition', textKey: 'cl_gels_chews' },
    { id: 'timing', catKey: 'cl_cat_general', textKey: 'cl_timing' },
  ],
  run: [
    { id: 'shoes', catKey: 'cl_cat_gear', textKey: 'cl_shoes_run' },
    { id: 'bib', catKey: 'cl_cat_gear', textKey: 'cl_bib' },
    { id: 'watch', catKey: 'cl_cat_gear', textKey: 'cl_watch' },
    { id: 'gels-r', catKey: 'cl_cat_nutrition', textKey: 'cl_gels' },
  ],
  bike: [
    { id: 'helmet-b', catKey: 'cl_cat_safety', textKey: 'cl_helmet_b' },
    { id: 'tires', catKey: 'cl_cat_gear', textKey: 'cl_tires' },
    { id: 'bottles-b', catKey: 'cl_cat_nutrition', textKey: 'cl_bottles' },
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
  const t = useT();
  const [raceType, setRaceType] = useState<RaceType>('tri');
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const toggle = (id: string) => setChecked((c) => ({ ...c, [id]: !c[id] }));
  const items = ALL_ITEMS[raceType];
  const doneCount = items.filter((i) => checked[i.id]).length;

  // Group items by category
  const categories: LangKey[] = [];
  items.forEach((item) => {
    if (!categories.includes(item.catKey)) categories.push(item.catKey);
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
            {t('reset')}
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
                {t(cat)}
              </AppText>
            </View>
            {items
              .filter((item) => item.catKey === cat)
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
                      {t(item.textKey)}
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
