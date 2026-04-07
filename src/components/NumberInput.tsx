import { StyleSheet, TextInput, View } from 'react-native';

import { Colors, Space } from '../theme';
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

export function NumberInput({ value, onChange, unit, hint, min, max, errorMsg }: Props) {
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
              borderColor: error ? Colors.heart : Colors.border,
              color: error ? Colors.heart : Colors.text,
            },
          ]}
          placeholderTextColor={Colors.textDim}
        />
        <View style={styles.unit}>
          <AppText weight="semibold" size={14} color={Colors.textMid}>
            {unit}
          </AppText>
        </View>
      </View>
      {error && (
        <AppText size={12} color={Colors.heart} style={{ marginBottom: 8, paddingLeft: 2 }}>
          {error}
        </AppText>
      )}
      {hint && !error && (
        <AppText size={12} color={Colors.textDim} style={styles.hint}>
          {hint}
        </AppText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 6,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.card,
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
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Space.radius.md,
    paddingHorizontal: 16,
  },
  hint: {
    lineHeight: 18,
    marginBottom: 16,
  },
});
