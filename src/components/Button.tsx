import { Pressable, StyleSheet, type ViewStyle } from 'react-native';

import { Colors, Font } from '../theme';
import { AppText } from './AppText';

type Variant = 'accent' | 'danger' | 'ghost' | 'surface';

type Props = {
  label: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  style?: ViewStyle;
};

export function Button({ label, onPress, variant = 'accent', disabled = false, style }: Props) {
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
        color={variant === 'accent' ? '#000' : variant === 'danger' ? '#fff' : Colors.textMid}
        style={{ letterSpacing: 2, fontFamily: Font.condensedBlack }}>
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  accent: {
    backgroundColor: Colors.accent,
  },
  danger: {
    backgroundColor: Colors.heart,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: Colors.border,
  },
  surface: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  disabled: {
    opacity: 0.4,
  },
  pressed: {
    opacity: 0.75,
  },
});
