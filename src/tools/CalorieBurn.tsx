import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { AppText } from '../components/AppText';
import { Colors, Sports, type SportKey } from '../theme';

type Intensity = 'low' | 'moderate' | 'high';

const SPORTS: SportKey[] = ['swim', 'bike', 'run', 'tri'];
const INTENSITY_OPTIONS: { id: Intensity; l: string }[] = [
  { id: 'low', l: 'Easy' },
  { id: 'moderate', l: 'Moderate' },
  { id: 'high', l: 'Hard' },
];
const METS: Record<SportKey, Record<Intensity, number>> = {
  swim: { low: 5.8, moderate: 8.3, high: 10 },
  bike: { low: 5.5, moderate: 8, high: 12 },
  run: { low: 7, moderate: 9.8, high: 14.5 },
  tri: { low: 8, moderate: 10.5, high: 13 },
  // 'all' is not a valid sport for this tool, but SportKey includes it
  all: { low: 7, moderate: 9, high: 12 },
};

export function CalorieBurn() {
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
                color={active ? Sports[id].color : Colors.textMid}>
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
            color={Colors.textDim}
            uppercase>
            Weight
          </AppText>
          <View style={styles.inputRow}>
            <TextInput
              value={weight}
              onChangeText={setWeight}
              placeholder="72"
              placeholderTextColor={Colors.textDim}
              keyboardType="decimal-pad"
              style={styles.input}
            />
            <View style={styles.unit}>
              <AppText size={11} color={Colors.textMid}>
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
            color={Colors.textDim}
            uppercase>
            Duration
          </AppText>
          <View style={styles.inputRow}>
            <TextInput
              value={hours}
              onChangeText={setHours}
              placeholder="1"
              placeholderTextColor={Colors.textDim}
              keyboardType="numeric"
              style={[styles.input, { flex: 1 }]}
            />
            <View style={styles.unit}>
              <AppText size={11} color={Colors.textMid}>
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
              <AppText size={11} color={Colors.textMid}>
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
                  active && { borderColor: sp.color, backgroundColor: `${sp.color}18` },
                ]}
                onPress={() => setIntensity(i.id)}>
                <AppText size={13} weight="semibold" color={active ? sp.color : Colors.textMid}>
                  {i.l}
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
          Calories Burned
        </AppText>
        <AppText condensed weight="black" size={52} color={sp.color}>
          {w > 0 && dur > 0 ? kcal : '--'}
        </AppText>
        <AppText size={13} color={Colors.textMid} style={{ marginTop: 2 }}>
          kcal · MET {met}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  segGroup: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  segBtn: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.card,
    alignItems: 'center',
  },
  row2: { flexDirection: 'row', gap: 10 },
  field: { marginBottom: 14 },
  fieldLabel: { letterSpacing: 2, marginBottom: 6 },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  input: {
    flex: 1,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 6,
    fontFamily: 'BarlowCondensedBlack',
    fontSize: 20,
    color: Colors.text,
    textAlign: 'center',
  },
  unit: {
    paddingHorizontal: 8,
    paddingVertical: 10,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
  },
  resultBox: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 20,
    alignItems: 'center',
  },
});
