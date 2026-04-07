import { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable } from 'react-native';

import { Colors } from '../theme';

type Props = {
  on: boolean;
  onToggle: () => void;
};

export function Toggle({ on, onToggle }: Props) {
  const anim = useRef(new Animated.Value(on ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: on ? 1 : 0,
      duration: 200,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
      useNativeDriver: false,
    }).start();
  }, [on, anim]);

  const bg = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors.border, Colors.accent],
  });

  const dotLeft = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [3, 21],
  });

  return (
    <Pressable onPress={onToggle} hitSlop={8}>
      <Animated.View
        style={{
          width: 44,
          height: 26,
          borderRadius: 13,
          backgroundColor: bg,
        }}>
        <Animated.View
          style={{
            position: 'absolute',
            top: 3,
            left: dotLeft,
            width: 20,
            height: 20,
            borderRadius: 10,
            backgroundColor: '#fff',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.3,
            shadowRadius: 2,
            elevation: 2,
          }}
        />
      </Animated.View>
    </Pressable>
  );
}
