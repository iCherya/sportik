import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { AppText } from '../components/AppText';
import { Colors } from '../theme';

export function SpeedPace() {
  const [speed, setSpeed] = useState('35');
  const [pace, setPace] = useState('1:42');

  const fromSpeed = (v: string) => {
    const s = parseFloat(v) || 0;
    if (!s) {
      setPace('');
      return;
    }
    const sp = 3600 / s;
    setPace(`${Math.floor(sp / 60)}:${String(Math.round(sp % 60)).padStart(2, '0')}`);
  };

  const fromPace = (v: string) => {
    setPace(v);
    const p = v.split(':');
    if (p.length === 2) {
      const secs = (parseInt(p[0]) || 0) * 60 + (parseInt(p[1]) || 0);
      if (secs > 0) setSpeed((3600 / secs).toFixed(1));
    }
  };

  const spd = parseFloat(speed) || 0;

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
          Speed
        </AppText>
        <View style={styles.inputRow}>
          <TextInput
            value={speed}
            onChangeText={(v) => {
              setSpeed(v);
              fromSpeed(v);
            }}
            placeholder="35"
            placeholderTextColor={Colors.textDim}
            keyboardType="decimal-pad"
            style={styles.input}
          />
          <View style={styles.unit}>
            <AppText size={12} color={Colors.textMid}>
              km/h
            </AppText>
          </View>
        </View>
      </View>

      <AppText size={20} color={Colors.textDim} style={{ textAlign: 'center', marginBottom: 8 }}>
        ⇅
      </AppText>

      <View style={styles.field}>
        <AppText
          style={styles.fieldLabel}
          condensed
          weight="bold"
          size={11}
          color={Colors.textDim}
          uppercase>
          Pace
        </AppText>
        <View style={styles.inputRow}>
          <TextInput
            value={pace}
            onChangeText={fromPace}
            placeholder="1:42"
            placeholderTextColor={Colors.textDim}
            style={styles.input}
          />
          <View style={styles.unit}>
            <AppText size={12} color={Colors.textMid}>
              min/km
            </AppText>
          </View>
        </View>
      </View>

      <View style={styles.infoBox}>
        {[
          ['40km bike', spd > 0 ? `${(40 / spd).toFixed(2)}h` : '--'],
          ['90km bike', spd > 0 ? `${(90 / spd).toFixed(2)}h` : '--'],
        ].map(([l, v]) => (
          <View key={l} style={styles.infoRow}>
            <AppText size={13} color={Colors.textMid}>
              {l}
            </AppText>
            <AppText condensed weight="bold" size={14}>
              {v}
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
  infoBox: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    overflow: 'hidden',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSub,
  },
});
