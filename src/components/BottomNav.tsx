import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet, View } from 'react-native';

import { useColors } from '../context/ThemeContext';
import { useT } from '../i18n';
import { type ColorPalette, Font } from '../theme';
import { NAV_ORDER, type Screen } from '../types';
import { AppText } from './AppText';

type Props = {
  screen: Screen;
  onNavigate: (screen: Screen) => void;
};

const NAV_ITEMS: {
  id: Screen;
  icon: string;
  labelKey: 'nav_home' | 'nav_tools' | 'nav_events' | 'nav_account';
}[] = [
  { id: 'home', icon: '🏠', labelKey: 'nav_home' },
  { id: 'tools', icon: '🛠', labelKey: 'nav_tools' },
  { id: 'events', icon: '📅', labelKey: 'nav_events' },
  { id: 'account', icon: '👤', labelKey: 'nav_account' },
];

const makeStyles = (c: ColorPalette) =>
  StyleSheet.create({
    nav: {
      flexDirection: 'row',
      backgroundColor: c.surface,
      borderTopWidth: 1,
      borderTopColor: c.border,
      paddingBottom: 20,
      paddingHorizontal: 4,
      position: 'relative',
    },
    indicator: {
      position: 'absolute',
      top: -1,
      width: 28,
      height: 2,
      backgroundColor: c.accent,
      borderRadius: 2,
    },
    item: {
      flex: 1,
      alignItems: 'center',
      paddingTop: 12,
      paddingBottom: 4,
      gap: 4,
    },
  });

export function BottomNav({ screen, onNavigate }: Props) {
  const t = useT();
  const colors = useColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const [navWidth, setNavWidth] = useState(0);
  const indicatorLeft = useRef(new Animated.Value(0)).current;

  const idx = NAV_ORDER.indexOf(screen);

  useEffect(() => {
    if (navWidth === 0) return;
    const tabWidth = navWidth / 4;
    const targetLeft = idx * tabWidth + (tabWidth - 28) / 2;
    Animated.timing(indicatorLeft, {
      toValue: targetLeft,
      duration: 220,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
      useNativeDriver: false,
    }).start();
  }, [screen, navWidth, idx, indicatorLeft]);

  return (
    <View style={styles.nav} onLayout={(e) => setNavWidth(e.nativeEvent.layout.width)}>
      <Animated.View style={[styles.indicator, { left: indicatorLeft }]} />
      {NAV_ITEMS.map((item) => {
        const active = screen === item.id;
        return (
          <Pressable key={item.id} style={styles.item} onPress={() => onNavigate(item.id)}>
            <AppText size={20} style={{ lineHeight: 24 }}>
              {item.icon}
            </AppText>
            <AppText
              weight="semibold"
              size={10}
              uppercase
              color={active ? colors.accent : colors.textDim}
              style={{ letterSpacing: 0.5, fontFamily: Font.bodySemiBold }}>
              {t(item.labelKey)}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}
