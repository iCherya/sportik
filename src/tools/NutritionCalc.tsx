import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { AppText } from '../components/AppText';
import { useColors } from '../context/ThemeContext';
import { type ColorPalette, Sports } from '../theme';

type Intensity = 'low' | 'moderate' | 'high';

const INTENSITY_OPTIONS: { id: Intensity; l: string }[] = [
  { id: 'low', l: 'Low' },
  { id: 'moderate', l: 'Moderate' },
  { id: 'high', l: 'High' },
];

const CARBS: Record<Intensity, number> = { low: 40, moderate: 60, high: 90 };
const FLUID: Record<Intensity, number> = { low: 500, moderate: 700, high: 900 };

const makeStyles = (c: ColorPalette) =>
  StyleSheet.create({
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
    segGroup: { flexDirection: 'row', gap: 8 },
    segBtn: {
      flex: 1,
      paddingVertical: 9,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.card,
      alignItems: 'center',
    },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    resultCard: {
      width: '47%',
      borderWidth: 1,
      borderRadius: 16,
      padding: 14,
      alignItems: 'center',
    },
  });

export function NutritionCalc() {
  const colors = useColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const [hours, setHours] = useState('4');
  const [mins, setMins] = useState('30');
  const [intensity, setIntensity] = useState<Intensity>('moderate');

  const dur = (parseFloat(hours) || 0) + (parseFloat(mins) || 0) / 60;
  const cr = CARBS[intensity];
  const fr = FLUID[intensity];
  const tc = Math.round(cr * dur);
  const tf = Math.round(((fr * dur) / 1000) * 10) / 10;

  const cards = [
    { label: 'Carbs', val: `${tc}g`, color: colors.accent, sub: `${cr}g/hr` },
    { label: 'Fluid', val: `${tf}L`, color: Sports.swim.color, sub: `${fr}ml/hr` },
    {
      label: 'Sodium',
      val: `${Math.round(500 * dur)}mg`,
      color: Sports.bike.color,
      sub: '500mg/hr',
    },
    { label: 'Gels', val: `${Math.ceil(tc / 25)}`, color: Sports.run.color, sub: '×25g' },
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
          Race Duration
        </AppText>
        <View style={styles.inputRow}>
          <TextInput
            value={hours}
            onChangeText={setHours}
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
            value={mins}
            onChangeText={setMins}
            placeholder="30"
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

      <View style={styles.field}>
        <AppText
          style={styles.fieldLabel}
          condensed
          weight="bold"
          size={11}
          color={colors.textDim}
          uppercase>
          Intensity
        </AppText>
        <View style={styles.segGroup}>
          {INTENSITY_OPTIONS.map((i) => {
            const active = intensity === i.id;
            return (
              <Pressable
                key={i.id}
                style={[
                  styles.segBtn,
                  active && { borderColor: colors.accent, backgroundColor: `${colors.accent}18` },
                ]}
                onPress={() => setIntensity(i.id)}>
                <AppText
                  size={13}
                  weight="semibold"
                  color={active ? colors.accent : colors.textMid}>
                  {i.l}
                </AppText>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.grid}>
        {cards.map((c) => (
          <View
            key={c.label}
            style={[
              styles.resultCard,
              { backgroundColor: `${c.color}11`, borderColor: `${c.color}33` },
            ]}>
            <AppText
              condensed
              weight="bold"
              size={10}
              color={c.color}
              uppercase
              style={{ letterSpacing: 1.5, marginBottom: 4 }}>
              {c.label}
            </AppText>
            <AppText condensed weight="black" size={32} color={c.color}>
              {c.val}
            </AppText>
            <AppText size={11} color={colors.textMid}>
              {c.sub}
            </AppText>
          </View>
        ))}
      </View>
    </View>
  );
}
