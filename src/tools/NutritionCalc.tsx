import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { AppText } from '../components/AppText';
import { Colors } from '../theme';

type Intensity = 'low' | 'moderate' | 'high';

const INTENSITY_OPTIONS: { id: Intensity; l: string }[] = [
  { id: 'low', l: 'Low' },
  { id: 'moderate', l: 'Moderate' },
  { id: 'high', l: 'High' },
];

const CARBS: Record<Intensity, number> = { low: 40, moderate: 60, high: 90 };
const FLUID: Record<Intensity, number> = { low: 500, moderate: 700, high: 900 };

export function NutritionCalc() {
  const [hours, setHours] = useState('4');
  const [mins, setMins] = useState('30');
  const [intensity, setIntensity] = useState<Intensity>('moderate');

  const dur = (parseFloat(hours) || 0) + (parseFloat(mins) || 0) / 60;
  const cr = CARBS[intensity];
  const fr = FLUID[intensity];
  const tc = Math.round(cr * dur);
  const tf = Math.round(((fr * dur) / 1000) * 10) / 10;

  const cards = [
    { label: 'Carbs', val: `${tc}g`, color: Colors.accent, sub: `${cr}g/hr` },
    { label: 'Fluid', val: `${tf}L`, color: Colors.swim, sub: `${fr}ml/hr` },
    { label: 'Sodium', val: `${Math.round(500 * dur)}mg`, color: Colors.bike, sub: '500mg/hr' },
    { label: 'Gels', val: `${Math.ceil(tc / 25)}`, color: Colors.run, sub: '×25g' },
  ];

  return (
    <View>
      <View style={styles.field}>
        <AppText
          style={styles.fieldLabel}
          condensed
          weight="bold"
          size={11}
          color={Colors.textDim}
          uppercase>
          Race Duration
        </AppText>
        <View style={styles.inputRow}>
          <TextInput
            value={hours}
            onChangeText={setHours}
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
            value={mins}
            onChangeText={setMins}
            placeholder="30"
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

      <View style={styles.field}>
        <AppText
          style={styles.fieldLabel}
          condensed
          weight="bold"
          size={11}
          color={Colors.textDim}
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
                  active && { borderColor: Colors.accent, backgroundColor: `${Colors.accent}18` },
                ]}
                onPress={() => setIntensity(i.id)}>
                <AppText
                  size={13}
                  weight="semibold"
                  color={active ? Colors.accent : Colors.textMid}>
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
            <AppText size={11} color={Colors.textMid}>
              {c.sub}
            </AppText>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
  segGroup: { flexDirection: 'row', gap: 8 },
  segBtn: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.card,
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
