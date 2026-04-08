import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { AppText } from '../components/AppText';
import { Colors } from '../theme';

const PRESETS = [
  { l: '5K', v: '5' },
  { l: '10K', v: '10' },
  { l: 'HM', v: '21.1' },
  { l: 'Mar', v: '42.2' },
];

export function RaceTimePredictor() {
  const [kd, setKd] = useState('10');
  const [kt, setKt] = useState('42');
  const [td2, setTd2] = useState('42.2');

  const t1 = (parseFloat(kt) || 0) * 60;
  const d1 = parseFloat(kd) || 0;
  const d2 = parseFloat(td2) || 0;
  const t2 = d1 > 0 && t1 > 0 ? t1 * Math.pow(d2 / d1, 1.06) : 0;

  const fmt = (secs: number) =>
    secs > 0
      ? `${Math.floor(secs / 3600)}h ${Math.floor((secs % 3600) / 60)}m ${Math.round(secs % 60)}s`
      : '--';

  const paceStr = (secs: number, d: number) =>
    d > 0 && secs > 0
      ? `${Math.floor(secs / d / 60)}:${String(Math.round((secs / d) % 60)).padStart(2, '0')}/km`
      : '--';

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
          Known Result
        </AppText>
        <View style={styles.inputRow}>
          <TextInput
            value={kd}
            onChangeText={setKd}
            placeholder="10"
            placeholderTextColor={Colors.textDim}
            keyboardType="decimal-pad"
            style={[styles.input, { flex: 1 }]}
          />
          <View style={styles.unit}>
            <AppText size={12} color={Colors.textMid}>
              km
            </AppText>
          </View>
          <TextInput
            value={kt}
            onChangeText={setKt}
            placeholder="42"
            placeholderTextColor={Colors.textDim}
            keyboardType="decimal-pad"
            style={[styles.input, { flex: 1 }]}
          />
          <View style={styles.unit}>
            <AppText size={12} color={Colors.textMid}>
              min
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
          Target Distance
        </AppText>
        <View style={styles.inputRow}>
          <TextInput
            value={td2}
            onChangeText={setTd2}
            placeholder="42.2"
            placeholderTextColor={Colors.textDim}
            keyboardType="decimal-pad"
            style={styles.input}
          />
          <View style={styles.unit}>
            <AppText size={12} color={Colors.textMid}>
              km
            </AppText>
          </View>
        </View>
        <View style={styles.presets}>
          {PRESETS.map((p) => {
            const active = td2 === p.v;
            return (
              <Pressable
                key={p.l}
                style={[
                  styles.preset,
                  active && { borderColor: Colors.run, backgroundColor: `${Colors.run}22` },
                ]}
                onPress={() => setTd2(p.v)}>
                <AppText
                  condensed
                  weight="bold"
                  size={12}
                  color={active ? Colors.run : Colors.textDim}>
                  {p.l}
                </AppText>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View
        style={[
          styles.resultBox,
          { backgroundColor: Colors.runBg, borderColor: `${Colors.run}33` },
        ]}>
        <AppText
          condensed
          weight="bold"
          size={11}
          color={Colors.run}
          uppercase
          style={{ letterSpacing: 2, marginBottom: 4 }}>
          Predicted
        </AppText>
        <AppText condensed weight="black" size={36} color={Colors.run}>
          {fmt(t2)}
        </AppText>
        <AppText size={13} color={Colors.textMid} style={{ marginTop: 2 }}>
          {paceStr(t2, d2)}
        </AppText>
      </View>

      <AppText size={11} color={Colors.textDim} style={{ textAlign: 'center' }}>
        Riegel formula (1977)
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  field: { marginBottom: 14 },
  fieldLabel: { letterSpacing: 2, marginBottom: 6 },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
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
  presets: { flexDirection: 'row', gap: 8 },
  preset: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    alignItems: 'center',
  },
  resultBox: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 20,
    alignItems: 'center',
    marginBottom: 12,
  },
});
