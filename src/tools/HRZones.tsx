import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { AppText } from '../components/AppText';
import { useColors } from '../context/ThemeContext';
import { type ColorPalette } from '../theme';

const ZONES = [
  { z: 1, name: 'Recovery', pct: [50, 60] as [number, number], color: '#4BEBA4' },
  { z: 2, name: 'Aerobic', pct: [60, 70] as [number, number], color: '#3B9EFF' },
  { z: 3, name: 'Tempo', pct: [70, 80] as [number, number], color: '#E8FF47' },
  { z: 4, name: 'Threshold', pct: [80, 90] as [number, number], color: '#FF8B3B' },
  { z: 5, name: 'VO₂ Max', pct: [90, 100] as [number, number], color: '#FF4F6A' },
];

type Method = 'maxhr' | 'hrr';

const makeStyles = (c: ColorPalette) =>
  StyleSheet.create({
    segGroup: { flexDirection: 'row', gap: 8, marginBottom: 16 },
    segBtn: {
      flex: 1,
      paddingVertical: 9,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.card,
      alignItems: 'center',
    },
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
    zonesCard: {
      backgroundColor: c.card,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 16,
      overflow: 'hidden',
    },
    zoneRow: { paddingVertical: 12, paddingHorizontal: 16 },
    miniBarBg: {
      marginLeft: 34,
      height: 6,
      backgroundColor: c.surface,
      borderRadius: 3,
      overflow: 'hidden',
      marginTop: 6,
    },
    miniBarFill: { height: '100%', borderRadius: 3 },
  });

export function HRZones() {
  const colors = useColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const [maxHR, setMaxHR] = useState('185');
  const [method, setMethod] = useState<Method>('maxhr');
  const [rhr, setRhr] = useState('52');

  const hr = parseInt(maxHR) || 0;
  const rh = parseInt(rhr) || 0;
  const calc = (pct: number) =>
    method === 'hrr' ? Math.round(rh + (hr - rh) * (pct / 100)) : Math.round(hr * (pct / 100));

  return (
    <View>
      {/* Method selector */}
      <View style={styles.segGroup}>
        {[
          { id: 'maxhr' as Method, l: 'Max HR %' },
          { id: 'hrr' as Method, l: 'HR Reserve' },
        ].map((m) => {
          const active = method === m.id;
          return (
            <Pressable
              key={m.id}
              style={[
                styles.segBtn,
                active && { borderColor: colors.heart, backgroundColor: `${colors.heart}18` },
              ]}
              onPress={() => setMethod(m.id)}>
              <AppText size={13} weight="semibold" color={active ? colors.heart : colors.textMid}>
                {m.l}
              </AppText>
            </Pressable>
          );
        })}
      </View>

      {/* Max HR */}
      <View style={styles.field}>
        <AppText
          style={styles.fieldLabel}
          condensed
          weight="bold"
          size={11}
          color={colors.textDim}
          uppercase>
          Max HR
        </AppText>
        <View style={styles.inputRow}>
          <TextInput
            value={maxHR}
            onChangeText={setMaxHR}
            placeholder="185"
            placeholderTextColor={colors.textDim}
            keyboardType="numeric"
            style={styles.input}
          />
          <View style={styles.unit}>
            <AppText size={12} color={colors.textMid}>
              bpm
            </AppText>
          </View>
        </View>
      </View>

      {/* Resting HR — HR Reserve only */}
      {method === 'hrr' && (
        <View style={styles.field}>
          <AppText
            style={styles.fieldLabel}
            condensed
            weight="bold"
            size={11}
            color={colors.textDim}
            uppercase>
            Resting HR
          </AppText>
          <View style={styles.inputRow}>
            <TextInput
              value={rhr}
              onChangeText={setRhr}
              placeholder="52"
              placeholderTextColor={colors.textDim}
              keyboardType="numeric"
              style={styles.input}
            />
            <View style={styles.unit}>
              <AppText size={12} color={colors.textMid}>
                bpm
              </AppText>
            </View>
          </View>
        </View>
      )}

      {/* Zones */}
      <View style={styles.zonesCard}>
        {ZONES.map((z, i) => {
          const lo = calc(z.pct[0]);
          const hi = calc(z.pct[1]);
          return (
            <View
              key={z.z}
              style={[
                styles.zoneRow,
                i < ZONES.length - 1 && {
                  borderBottomWidth: 1,
                  borderBottomColor: colors.borderSub,
                },
              ]}>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <AppText condensed weight="black" size={18} color={z.color} style={{ width: 24 }}>
                    Z{z.z}
                  </AppText>
                  <AppText weight="semibold" size={13} style={{ flex: 1 }}>
                    {z.name}
                  </AppText>
                  <AppText condensed weight="bold" size={14} color={z.color}>
                    {hr > 0 ? `${lo}–${hi}` : '--'} bpm
                  </AppText>
                </View>
                <View style={styles.miniBarBg}>
                  <View
                    style={[
                      styles.miniBarFill,
                      { width: `${z.pct[1]}%` as `${number}%`, backgroundColor: `${z.color}66` },
                    ]}
                  />
                </View>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}
