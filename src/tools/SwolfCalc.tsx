import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { AppText } from '../components/AppText';
import { Colors } from '../theme';

export function SwolfCalc() {
  const [strokes, setStrokes] = useState('18');
  const [secs, setSecs] = useState('45');
  const [pool, setPool] = useState('50');

  const sw = (parseInt(strokes) || 0) + (parseInt(secs) || 0);
  const resultColor =
    sw === 0
      ? Colors.textDim
      : sw < 30
        ? Colors.accent
        : sw < 35
          ? Colors.run
          : sw < 40
            ? Colors.bike
            : Colors.heart;
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
                active && { borderColor: Colors.swim, backgroundColor: `${Colors.swim}18` },
              ]}
              onPress={() => setPool(v)}>
              <AppText size={13} weight="semibold" color={active ? Colors.swim : Colors.textMid}>
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
          color={Colors.textDim}
          uppercase>
          Strokes / Length
        </AppText>
        <View style={styles.inputRow}>
          <TextInput
            value={strokes}
            onChangeText={setStrokes}
            placeholder="18"
            placeholderTextColor={Colors.textDim}
            keyboardType="numeric"
            style={styles.input}
          />
          <View style={styles.unit}>
            <AppText size={12} color={Colors.textMid}>
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
          color={Colors.textDim}
          uppercase>
          Time / Length
        </AppText>
        <View style={styles.inputRow}>
          <TextInput
            value={secs}
            onChangeText={setSecs}
            placeholder="45"
            placeholderTextColor={Colors.textDim}
            keyboardType="numeric"
            style={styles.input}
          />
          <View style={styles.unit}>
            <AppText size={12} color={Colors.textMid}>
              sec
            </AppText>
          </View>
        </View>
      </View>

      <View
        style={[
          styles.resultBox,
          { backgroundColor: Colors.swimBg, borderColor: `${Colors.swim}33` },
        ]}>
        <AppText
          condensed
          weight="bold"
          size={11}
          color={Colors.swim}
          uppercase
          style={{ letterSpacing: 2, marginBottom: 4 }}>
          SWOLF Score
        </AppText>
        <AppText condensed weight="black" size={52} color={resultColor}>
          {sw || '--'}
        </AppText>
        <AppText size={13} color={Colors.textMid} style={{ marginTop: 2 }}>
          {rating || 'enter values'}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  segGroup: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  segBtn: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.card,
    alignItems: 'center',
  },
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
  resultBox: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 20,
    alignItems: 'center',
  },
});
