import { Pressable, StyleSheet, View } from 'react-native';

import { Colors } from '../theme';
import { AppText } from './AppText';

type Props = {
  icon: string;
  iconBg: string;
  label: string;
  right?: React.ReactNode;
  onPress?: () => void;
  danger?: boolean;
};

export function Row({ icon, iconBg, label, right, onPress, danger = false }: Props) {
  return (
    <Pressable style={styles.row} onPress={onPress} disabled={!onPress}>
      <View style={[styles.iconWrap, { backgroundColor: iconBg }]}>
        <AppText size={16}>{icon}</AppText>
      </View>
      <AppText
        weight="medium"
        size={14}
        color={danger ? Colors.heart : Colors.text}
        style={styles.label}>
        {label}
      </AppText>
      {right && <View style={styles.right}>{right}</View>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSub,
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  label: {
    flex: 1,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
