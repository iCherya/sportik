import { useMemo, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { AppText } from '../components/AppText';
import { useColors } from '../context/ThemeContext';
import { type ColorPalette, Sports } from '../theme';

const RULES = [
  {
    min: 0,
    max: 14,
    icon: '🧊',
    label: 'Below 14°C',
    status: 'Cold — extra thermal gear needed',
    badge: 'DANGER',
    bc: '#3B9EFF',
  },
  {
    min: 14,
    max: 16,
    icon: '🌊',
    label: '14–16°C',
    status: 'Wetsuit mandatory',
    badge: 'REQUIRED',
    bc: Sports.swim.color,
  },
  {
    min: 16,
    max: 22,
    icon: '✅',
    label: '16–22°C',
    status: 'Wetsuit allowed',
    badge: 'ALLOWED',
    bc: Sports.run.color,
  },
  {
    min: 22,
    max: 24,
    icon: '⚠️',
    label: '22–24°C',
    status: 'Wetsuit optional',
    badge: 'OPTIONAL',
    bc: '#E8FF47',
  },
  {
    min: 24,
    max: 26,
    icon: '🚫',
    label: '24–26°C',
    status: 'Wetsuit banned',
    badge: 'BANNED',
    bc: Sports.bike.color,
  },
  {
    min: 26,
    max: 99,
    icon: '🔥',
    label: 'Above 26°C',
    status: 'No wetsuit — heat risk',
    badge: 'TOO HOT',
    bc: '#FF4F6A',
  },
];

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
    currentCard: {
      borderWidth: 1,
      borderRadius: 18,
      padding: 20,
      alignItems: 'center',
      marginBottom: 14,
    },
    rulesCard: {
      backgroundColor: c.card,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 16,
      overflow: 'hidden',
    },
    ruleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingVertical: 12,
      paddingHorizontal: 14,
    },
  });

export function WetsuitGuide() {
  const colors = useColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const [temp, setTemp] = useState('18');
  const t = parseFloat(temp) || 0;
  const cur = RULES.find((r) => t >= r.min && t < r.max) ?? RULES[RULES.length - 1];

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
          Water Temp
        </AppText>
        <View style={styles.inputRow}>
          <TextInput
            value={temp}
            onChangeText={setTemp}
            placeholder="18"
            placeholderTextColor={colors.textDim}
            keyboardType="decimal-pad"
            style={styles.input}
          />
          <View style={styles.unit}>
            <AppText size={12} color={colors.textMid}>
              °C
            </AppText>
          </View>
        </View>
      </View>

      {t > 0 && (
        <View
          style={[
            styles.currentCard,
            { backgroundColor: `${cur.bc}11`, borderColor: `${cur.bc}44` },
          ]}>
          <AppText size={32} style={{ marginBottom: 8 }}>
            {cur.icon}
          </AppText>
          <AppText
            condensed
            weight="black"
            size={16}
            color={cur.bc}
            uppercase
            style={{ letterSpacing: 1.5, marginBottom: 6 }}>
            {cur.badge}
          </AppText>
          <AppText weight="medium" size={14}>
            {cur.status}
          </AppText>
        </View>
      )}

      <View style={styles.rulesCard}>
        {RULES.map((r, i) => {
          const active = t >= r.min && t < r.max;
          return (
            <View
              key={r.label}
              style={[
                styles.ruleRow,
                i < RULES.length - 1 && {
                  borderBottomWidth: 1,
                  borderBottomColor: colors.borderSub,
                },
                active && { backgroundColor: `${r.bc}11` },
              ]}>
              <AppText size={18} style={{ width: 28 }}>
                {r.icon}
              </AppText>
              <AppText weight="medium" size={13} style={{ flex: 1 }}>
                {r.label}
              </AppText>
              <View
                style={{
                  backgroundColor: `${r.bc}22`,
                  paddingHorizontal: 10,
                  paddingVertical: 3,
                  borderRadius: 6,
                }}>
                <AppText
                  condensed
                  weight="black"
                  size={10}
                  color={r.bc}
                  uppercase
                  style={{ letterSpacing: 0.5 }}>
                  {r.badge}
                </AppText>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}
