import { useEffect, useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useColors } from '../context/ThemeContext';
import { type ColorPalette, Font } from '../theme';
import { AppText } from './AppText';

type Props = {
  onBack: () => void;
  title: string;
  backLabel?: string;
  badge?: React.ReactNode;
  children: React.ReactNode;
};

const makeStyles = (c: ColorPalette) =>
  StyleSheet.create({
    container: {
      backgroundColor: c.bg,
      zIndex: 80,
    },
    header: {
      paddingHorizontal: 20,
      paddingBottom: 18,
      borderBottomWidth: 1,
      borderBottomColor: c.border,
    },
    back: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 14,
    },
    body: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 20,
    },
  });

export function Overlay({ onBack, title, backLabel = 'Back', badge, children }: Props) {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const translateY = useSharedValue(800);

  useEffect(() => {
    translateY.value = withTiming(0, {
      duration: 280,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
    });
  }, [translateY]);

  const handleBack = () => {
    translateY.value = withTiming(
      800,
      { duration: 240, easing: Easing.bezier(0.4, 0, 0.2, 1) },
      () => runOnJS(onBack)()
    );
  };

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[StyleSheet.absoluteFill, styles.container, animStyle]}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Pressable style={styles.back} onPress={handleBack}>
          <AppText size={18} color={colors.textMid}>
            ←
          </AppText>
          <AppText weight="medium" size={13} color={colors.textMid}>
            {backLabel}
          </AppText>
        </Pressable>
        {badge}
        <AppText
          condensed
          weight="black"
          size={26}
          style={{ letterSpacing: 0.5, fontFamily: Font.bodyBold }}>
          {title}
        </AppText>
      </View>

      <ScrollView
        style={styles.body}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}>
        {children}
      </ScrollView>
    </Animated.View>
  );
}
