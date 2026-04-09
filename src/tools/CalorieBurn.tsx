import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { AppText } from '../components/AppText';
import { useColors } from '../context/ThemeContext';
import { type LangKey, useT } from '../i18n';
import { type ColorPalette, Sports, type SportKey } from '../theme';

type Intensity = 'low' | 'moderate' | 'high';

const SPORTS: SportKey[] = ['swim', 'bike', 'run', 'tri'];
const INTENSITY_OPTIONS: { id: Intensity; lKey: LangKey }[] = [
  { id: 'low', lKey: 'int_easy' },
  { id: 'moderate', lKey: 'int_moderate' },
  { id: 'high', lKey: 'int_hard' },
];
const METS: Record<SportKey, Record<Intensity, number>> = {
  swim: { low: 5.8, moderate: 8.3, high: 10 },
  bike: { low: 5.5, moderate: 8, high: 12 },
  run: { low: 7, moderate: 9.8, high: 14.5 },
  tri: { low: 8, moderate: 10.5, high: 13 },
  // 'all' is not a valid sport for this tool, but SportKey includes it
  all: { low: 7, moderate: 9, high: 12 },
};

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
    row2: { flexDirection: 'row', gap: 10 },
    field: { marginBottom: 14 },
    fieldLabel: { letterSpacing: 2, marginBottom: 6 },
    inputRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    input: {
      flex: 1,
      backgroundColor: c.card,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 12,
      paddingVertical: 12,
      paddingHorizontal: 6,
      fontFamily: 'BarlowCondensedBlack',
      fontSize: 20,
      color: c.text,
      textAlign: 'center',
    },
    unit: {
      paddingHorizontal: 8,
      paddingVertical: 10,
      backgroundColor: c.surface,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 10,
    },
    resultBox: {
      borderWidth: 1,
      borderRadius: 18,
      padding: 20,
      alignItems: 'center',
    },
  });

export function CalorieBurn() {
  const colors = useColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const t = useT();
  const [weight, setWeight] = useState('72');
  const [hours, setHours] = useState('1');
  const [mins, setMins] = useState('30');
  const [sport, setSport] = useState<SportKey>('run');
  const [intensity, setIntensity] = useState<Intensity>('moderate');

  const w = parseFloat(weight) || 0;
  const dur = (parseFloat(hours) || 0) + (parseFloat(mins) || 0) / 60;
  const met = METS[sport]?.[intensity] ?? 9;
  const kcal = Math.round(met * w * dur);
  const sp = Sports[sport];

  return (
    <View>
      <View style={styles.segGroup}>
        {SPORTS.map((id) => {
          const active = sport === id;
          return (
            <Pressable
              key={id}
              style={[
                styles.segBtn,
                active && {
                  borderColor: Sports[id].color,
                  backgroundColor: `${Sports[id].color}18`,
                },
              ]}
              onPress={() => setSport(id)}>
              <AppText
                size={13}
                weight="semibold"
                color={active ? Sports[id].color : colors.textMid}>
                {Sports[id].icon}
              </AppText>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.row2}>
        <View style={[styles.field, { flex: 1 }]}>
          <AppText
            style={styles.fieldLabel}
            condensed
            weight="bold"
            size={11}
            color={colors.textDim}
            uppercase>
            {t('tool_weight')}
          </AppText>
          <View style={styles.inputRow}>
            <TextInput
              value={weight}
              onChangeText={setWeight}
              placeholder="72"
              placeholderTextColor={colors.textDim}
              keyboardType="decimal-pad"
              style={styles.input}
            />
            <View style={styles.unit}>
              <AppText size={11} color={colors.textMid}>
                kg
              </AppText>
            </View>
          </View>
        </View>
        <View style={[styles.field, { flex: 1 }]}>
          <AppText
            style={styles.fieldLabel}
            condensed
            weight="bold"
            size={11}
            color={colors.textDim}
            uppercase>
            {t('tool_duration')}
          </AppText>
          <View style={styles.inputRow}>
            <TextInput
              value={hours}
              onChangeText={setHours}
              placeholder="1"
              placeholderTextColor={colors.textDim}
              keyboardType="numeric"
              style={[styles.input, { flex: 1 }]}
            />
            <View style={styles.unit}>
              <AppText size={11} color={colors.textMid}>
                h
              </AppText>
            </View>
            <TextInput
              value={mins}
              onChangeText={setMins}
              placeholder="30"
              placeholderTextColor={colors.textDim}
              keyboardType="numeric"
              style={[styles.input, { flex: 1 }]}
            />
            <View style={styles.unit}>
              <AppText size={11} color={colors.textMid}>
                m
              </AppText>
            </View>
          </View>
        </View>
      </View>

      <View style={[styles.field, { marginTop: 4 }]}>
        <AppText
          style={styles.fieldLabel}
          condensed
          weight="bold"
          size={11}
          color={colors.textDim}
          uppercase>
          {t('tool_intensity')}
        </AppText>
        <View style={styles.segGroup}>
          {INTENSITY_OPTIONS.map((i) => {
            const active = intensity === i.id;
            return (
              <Pressable
                key={i.id}
                style={[
                  styles.segBtn,
                  active && { borderColor: sp.color, backgroundColor: `${sp.color}18` },
                ]}
                onPress={() => setIntensity(i.id)}>
                <AppText size={13} weight="semibold" color={active ? sp.color : colors.textMid}>
                  {t(i.lKey)}
                </AppText>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={[styles.resultBox, { backgroundColor: sp.bg, borderColor: `${sp.color}33` }]}>
        <AppText
          condensed
          weight="bold"
          size={11}
          color={sp.color}
          uppercase
          style={{ letterSpacing: 2, marginBottom: 4 }}>
          {t('cb_result_label')}
        </AppText>
        <AppText condensed weight="black" size={52} color={sp.color}>
          {w > 0 && dur > 0 ? kcal : '--'}
        </AppText>
        <AppText size={13} color={colors.textMid} style={{ marginTop: 2 }}>
          {`${t('cb_result_sub')} ${met}`}
        </AppText>
      </View>
    </View>
  );
}
