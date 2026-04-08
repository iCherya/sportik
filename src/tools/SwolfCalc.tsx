import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { AppText } from '../components/AppText';
import { useColors } from '../context/ThemeContext';
import { type ColorPalette, Sports } from '../theme';

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
    },
  });

export function SwolfCalc() {
  const colors = useColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const [strokes, setStrokes] = useState('18');
  const [secs, setSecs] = useState('45');
  const [pool, setPool] = useState('50');

  const sw = (parseInt(strokes) || 0) + (parseInt(secs) || 0);
  const resultColor =
    sw === 0
      ? colors.textDim
      : sw < 30
        ? colors.accent
        : sw < 35
          ? Sports.run.color
          : sw < 40
            ? Sports.bike.color
            : colors.heart;
  const rating =
    sw === 0
      ? null
      : sw < 30
        ? 'Elite'
        : sw < 35
          ? 'Advanced'
          : sw < 40
            ? 'Intermediate'
            : 'Developing';

  return (
    <View>
      <View style={styles.segGroup}>
        {(['25', '50'] as const).map((v) => {
          const active = pool === v;
          return (
            <Pressable
              key={v}
              style={[
                styles.segBtn,
                active && {
                  borderColor: Sports.swim.color,
                  backgroundColor: `${Sports.swim.color}18`,
                },
              ]}
              onPress={() => setPool(v)}>
              <AppText
                size={13}
                weight="semibold"
                color={active ? Sports.swim.color : colors.textMid}>
                {v}m
              </AppText>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.field}>
        <AppText
          style={styles.fieldLabel}
          condensed
          weight="bold"
          size={11}
          color={colors.textDim}
          uppercase>
          Strokes / Length
        </AppText>
        <View style={styles.inputRow}>
          <TextInput
            value={strokes}
            onChangeText={setStrokes}
            placeholder="18"
            placeholderTextColor={colors.textDim}
            keyboardType="numeric"
            style={styles.input}
          />
          <View style={styles.unit}>
            <AppText size={12} color={colors.textMid}>
              strokes
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
          Time / Length
        </AppText>
        <View style={styles.inputRow}>
          <TextInput
            value={secs}
            onChangeText={setSecs}
            placeholder="45"
            placeholderTextColor={colors.textDim}
            keyboardType="numeric"
            style={styles.input}
          />
          <View style={styles.unit}>
            <AppText size={12} color={colors.textMid}>
              sec
            </AppText>
          </View>
        </View>
      </View>

      <View
        style={[
          styles.resultBox,
          { backgroundColor: Sports.swim.bg, borderColor: `${Sports.swim.color}33` },
        ]}>
        <AppText
          condensed
          weight="bold"
          size={11}
          color={Sports.swim.color}
          uppercase
          style={{ letterSpacing: 2, marginBottom: 4 }}>
          SWOLF Score
        </AppText>
        <AppText condensed weight="black" size={52} color={resultColor}>
          {sw || '--'}
        </AppText>
        <AppText size={13} color={colors.textMid} style={{ marginTop: 2 }}>
          {rating || 'enter values'}
        </AppText>
      </View>
    </View>
  );
}
