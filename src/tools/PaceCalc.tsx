import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { AppText } from '../components/AppText';
import { useColors } from '../context/ThemeContext';
import { type ColorPalette, Sports, type SportKey } from '../theme';

const SPORTS: SportKey[] = ['run', 'bike', 'swim'];

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
    resultBox: {
      borderWidth: 1,
      borderRadius: 18,
      padding: 20,
      alignItems: 'center',
      marginBottom: 14,
    },
    infoBox: {
      backgroundColor: c.card,
      borderWidth: 1,
      borderColor: c.border,
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
      borderBottomColor: c.borderSub,
    },
  });

export function PaceCalc() {
  const colors = useColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const [h, setH] = useState('0');
  const [m, setM] = useState('45');
  const [s, setS] = useState('00');
  const [dist, setDist] = useState('10');
  const [sport, setSport] = useState<SportKey>('run');

  const totalS = (parseInt(h) || 0) * 3600 + (parseInt(m) || 0) * 60 + (parseInt(s) || 0);
  const d = parseFloat(dist) || 0;
  const dk = sport === 'swim' ? d / 10 : d;
  const pS = dk > 0 ? totalS / dk : 0;
  const pM = Math.floor(pS / 60);
  const pSec = Math.round(pS % 60);
  const pace = dk > 0 ? `${pM}:${String(pSec).padStart(2, '0')}` : '--:--';
  const sp = Sports[sport];

  const speedKph = dk > 0 && totalS > 0 ? (dk / (totalS / 3600)).toFixed(1) : '--';
  const marathonEquiv =
    dk > 0 && totalS > 0
      ? (() => {
          const s2 = Math.round(pS * 42.2);
          return `${Math.floor(s2 / 3600)}h ${Math.floor((s2 % 3600) / 60)}m`;
        })()
      : '--';

  return (
    <View>
      {/* Sport selector */}
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
                {Sports[id].icon} {Sports[id].label}
              </AppText>
            </Pressable>
          );
        })}
      </View>

      {/* Time input */}
      <View style={styles.field}>
        <AppText
          style={styles.fieldLabel}
          condensed
          weight="bold"
          size={11}
          color={colors.textDim}
          uppercase>
          Target Time
        </AppText>
        <View style={styles.inputRow}>
          <TextInput
            value={h}
            onChangeText={setH}
            placeholder="0"
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
            value={m}
            onChangeText={setM}
            placeholder="45"
            placeholderTextColor={colors.textDim}
            keyboardType="numeric"
            style={[styles.input, { flex: 1 }]}
          />
          <View style={styles.unit}>
            <AppText size={12} color={colors.textMid}>
              m
            </AppText>
          </View>
          <TextInput
            value={s}
            onChangeText={setS}
            placeholder="00"
            placeholderTextColor={colors.textDim}
            keyboardType="numeric"
            style={[styles.input, { flex: 1 }]}
          />
          <View style={styles.unit}>
            <AppText size={12} color={colors.textMid}>
              s
            </AppText>
          </View>
        </View>
      </View>

      {/* Distance input */}
      <View style={styles.field}>
        <AppText
          style={styles.fieldLabel}
          condensed
          weight="bold"
          size={11}
          color={colors.textDim}
          uppercase>
          Distance
        </AppText>
        <View style={styles.inputRow}>
          <TextInput
            value={dist}
            onChangeText={setDist}
            placeholder="10"
            placeholderTextColor={colors.textDim}
            keyboardType="decimal-pad"
            style={styles.input}
          />
          <View style={styles.unit}>
            <AppText size={12} color={colors.textMid}>
              {sport === 'swim' ? '×100m' : 'km'}
            </AppText>
          </View>
        </View>
      </View>

      {/* Result box */}
      <View style={[styles.resultBox, { backgroundColor: sp.bg, borderColor: `${sp.color}33` }]}>
        <AppText
          condensed
          weight="bold"
          size={11}
          color={sp.color}
          uppercase
          style={{ letterSpacing: 2, marginBottom: 4 }}>
          Your Pace
        </AppText>
        <AppText condensed weight="black" size={52} color={sp.color}>
          {pace}
        </AppText>
        <AppText size={13} color={colors.textMid} style={{ marginTop: 2 }}>
          min / {sport === 'swim' ? '100m' : 'km'}
        </AppText>
      </View>

      {/* Info rows */}
      <View style={styles.infoBox}>
        {[
          ['Speed', `${speedKph} km/h`],
          ['Marathon equiv', marathonEquiv],
        ].map(([l, v]) => (
          <View key={l} style={styles.infoRow}>
            <AppText size={13} color={colors.textMid}>
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
