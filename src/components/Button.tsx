import { useMemo } from 'react';
import { Pressable, StyleSheet, type ViewStyle } from 'react-native';

import { useColors } from '../context/ThemeContext';
import { type ColorPalette, Font } from '../theme';
import { AppText } from './AppText';

type Variant = 'accent' | 'danger' | 'ghost' | 'surface';

type Props = {
  label: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  style?: ViewStyle;
};

const makeStyles = (c: ColorPalette) =>
  StyleSheet.create({
    base: {
      width: '100%',
      paddingVertical: 16,
      paddingHorizontal: 12,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    accent: { backgroundColor: c.accent },
    danger: { backgroundColor: c.heart },
    ghost: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderStyle: 'dashed',
      borderColor: c.border,
    },
    surface: {
      backgroundColor: c.card,
      borderWidth: 1,
      borderColor: c.border,
    },
    disabled: { opacity: 0.4 },
    pressed: { opacity: 0.75 },
  });

export function Button({ label, onPress, variant = 'accent', disabled = false, style }: Props) {
  const colors = useColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        disabled && styles.disabled,
        pressed && styles.pressed,
        style,
      ]}>
      <AppText
        condensed
        weight="black"
        size={18}
        uppercase
        color={variant === 'accent' ? '#000' : variant === 'danger' ? '#fff' : colors.textMid}
        style={{ letterSpacing: 2, fontFamily: Font.bodyBold }}>
        {label}
      </AppText>
    </Pressable>
  );
}
