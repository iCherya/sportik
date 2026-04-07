import { StyleSheet, View, type ViewStyle } from 'react-native';

import { Colors, Space } from '../theme';

type Props = {
  children: React.ReactNode;
  style?: ViewStyle;
  highlight?: boolean;
};

export function Card({ children, style, highlight = false }: Props) {
  return <View style={[styles.card, highlight && styles.cardHighlight, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Space.radius.card,
    padding: Space.card,
  },
  cardHighlight: {
    backgroundColor: Colors.cardHi,
  },
});
