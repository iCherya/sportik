import { useMemo } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';

import { useColors } from '../context/ThemeContext';
import { type ColorPalette, Space } from '../theme';

type Props = {
  children: React.ReactNode;
  style?: ViewStyle;
  highlight?: boolean;
};

const makeStyles = (c: ColorPalette) =>
  StyleSheet.create({
    card: {
      backgroundColor: c.card,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: Space.radius.card,
      padding: Space.card,
    },
    cardHighlight: {
      backgroundColor: c.cardHi,
    },
  });

export function Card({ children, style, highlight = false }: Props) {
  const colors = useColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  return <View style={[styles.card, highlight && styles.cardHighlight, style]}>{children}</View>;
}
