import { useMemo } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { useColors } from '../context/ThemeContext';
import { type ColorPalette, Space } from '../theme';
import { AppText } from './AppText';

type Props = {
  value: string;
  onChange: (v: string) => void;
  unit: string;
  hint?: string;
  min?: number;
  max?: number;
  errorMsg?: string;
};

const makeStyles = (c: ColorPalette) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      gap: 8,
      marginBottom: 6,
    },
    input: {
      flex: 1,
      backgroundColor: c.card,
      borderWidth: 1,
      borderRadius: Space.radius.md,
      padding: 16,
      fontFamily: 'BarlowCondensedBlack',
      fontSize: 32,
      textAlign: 'center',
    },
    unit: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: c.surface,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: Space.radius.md,
      paddingHorizontal: 16,
    },
    hint: {
      lineHeight: 18,
      marginBottom: 16,
    },
  });

export function NumberInput({ value, onChange, unit, hint, min, max, errorMsg }: Props) {
  const colors = useColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const num = parseFloat(value);
  const hasValue = value !== '' && value !== null;
  const outOfRange =
    hasValue &&
    !isNaN(num) &&
    ((min !== undefined && num < min) || (max !== undefined && num > max));
  const notANumber = hasValue && isNaN(num);

  const error = notANumber
    ? 'Please enter a valid number'
    : outOfRange
      ? (errorMsg ?? `Enter a value between ${min} and ${max}`)
      : null;

  const handleChange = (v: string) => {
    if (v === '' || /^\d*\.?\d*$/.test(v)) onChange(v);
  };

  return (
    <View style={{ marginBottom: error ? 8 : 12 }}>
      <View style={styles.row}>
        <TextInput
          value={value}
          onChangeText={handleChange}
          keyboardType="decimal-pad"
          style={[
            styles.input,
            {
              borderColor: error ? colors.heart : colors.border,
              color: error ? colors.heart : colors.text,
            },
          ]}
          placeholderTextColor={colors.textDim}
        />
        <View style={styles.unit}>
          <AppText weight="semibold" size={14} color={colors.textMid}>
            {unit}
          </AppText>
        </View>
      </View>
      {error && (
        <AppText size={12} color={colors.heart} style={{ marginBottom: 8, paddingLeft: 2 }}>
          {error}
        </AppText>
      )}
      {hint && !error && (
        <AppText size={12} color={colors.textDim} style={styles.hint}>
          {hint}
        </AppText>
      )}
    </View>
  );
}
