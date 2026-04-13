import { useEffect, useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { useColors } from '../context/ThemeContext';
import { type ColorPalette, Font, Space } from '../theme';
import { AppText } from './AppText';

type Props = {
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxHeight?: `${number}%` | number;
};

const makeStyles = (c: ColorPalette) =>
  StyleSheet.create({
    backdrop: {
      backgroundColor: 'rgba(0,0,0,0.65)',
    },
    anchor: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    sheet: {
      backgroundColor: c.surface,
      borderTopLeftRadius: Space.radius.overlay,
      borderTopRightRadius: Space.radius.overlay,
      paddingTop: 20,
      paddingHorizontal: 20,
      maxHeight: '80%',
    },
    handle: {
      width: 36,
      height: 4,
      backgroundColor: c.border,
      borderRadius: 2,
      alignSelf: 'center',
      marginBottom: 18,
    },
  });

export function Sheet({ onClose, title, children, maxHeight = '80%' }: Props) {
  const colors = useColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const translateY = useSharedValue(600);

  useEffect(() => {
    translateY.value = withTiming(0, {
      duration: 260,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
    });
  }, [translateY]);

  const handleClose = () => {
    translateY.value = withTiming(
      600,
      { duration: 220, easing: Easing.bezier(0.4, 0, 0.2, 1) },
      () => runOnJS(onClose)()
    );
  };

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      <Pressable style={[StyleSheet.absoluteFill, styles.backdrop]} onPress={handleClose} />
      <View style={styles.anchor} pointerEvents="box-none">
        <Animated.View
          style={[styles.sheet, { maxHeight }, animStyle]}
          onStartShouldSetResponder={() => true}>
          <View style={styles.handle} />
          {title && (
            <AppText
              condensed
              weight="black"
              size={22}
              style={{ marginBottom: 18, fontFamily: Font.bodyBold }}>
              {title}
            </AppText>
          )}
          <ScrollView
            showsVerticalScrollIndicator={false}
            bounces={false}
            contentContainerStyle={{ paddingBottom: 32 }}>
            {children}
          </ScrollView>
        </Animated.View>
      </View>
    </View>
  );
}
