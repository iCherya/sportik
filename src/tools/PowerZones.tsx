import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { AppText } from '../components/AppText';
import { Colors } from '../theme';

const ZONES = [
  { z: 1, name: 'Active Recovery', pct: [0, 55] as [number, number], color: '#4BEBA4' },
  { z: 2, name: 'Endurance', pct: [55, 75] as [number, number], color: '#3B9EFF' },
  { z: 3, name: 'Tempo', pct: [75, 90] as [number, number], color: Colors.accent },
  { z: 4, name: 'Threshold', pct: [90, 105] as [number, number], color: '#FF8B3B' },
  { z: 5, name: 'VO₂ Max', pct: [105, 120] as [number, number], color: '#FF4F6A' },
  { z: 6, name: 'Anaerobic', pct: [120, 150] as [number, number], color: '#B57BFF' },
  { z: 7, name: 'Neuromuscular', pct: [150, 999] as [number, number], color: '#FF2255' },
];

export function PowerZones() {
  const [ftp, setFtp] = useState('245');
  const f = parseInt(ftp) || 0;

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
          FTP
        </AppText>
        <View style={styles.inputRow}>
          <TextInput
            value={ftp}
            onChangeText={setFtp}
            placeholder="245"
            placeholderTextColor={Colors.textDim}
            keyboardType="numeric"
            style={styles.input}
          />
          <View style={styles.unit}>
            <AppText size={12} color={Colors.textMid}>
              W
            </AppText>
          </View>
        </View>
      </View>

      <View style={styles.zonesCard}>
        {ZONES.map((z, i) => {
          const lo = z.pct[0] === 0 ? 0 : Math.round((f * z.pct[0]) / 100);
          const hi = z.pct[1] === 999 ? 'Max' : Math.round((f * z.pct[1]) / 100);
          return (
            <View
              key={z.z}
              style={[
                styles.zoneRow,
                i < ZONES.length - 1 && {
                  borderBottomWidth: 1,
                  borderBottomColor: Colors.borderSub,
                },
              ]}>
              <AppText condensed weight="black" size={16} color={z.color} style={{ width: 24 }}>
                Z{z.z}
              </AppText>
              <AppText weight="semibold" size={13} style={{ flex: 1 }}>
                {z.name}
              </AppText>
              <AppText condensed weight="bold" size={14} color={z.color}>
                {f > 0 ? `${lo}–${hi}` : '--'} W
              </AppText>
            </View>
          );
        })}
      </View>

      <AppText size={11} color={Colors.textDim} style={styles.footnote}>
        FTP = power sustainable for ~60 min. Test: 20-min all-out × 0.95.
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  field: { marginBottom: 16 },
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
  zonesCard: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
  },
  zoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  footnote: { lineHeight: 16, textAlign: 'center' },
});
