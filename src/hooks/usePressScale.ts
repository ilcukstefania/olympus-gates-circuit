import { useCallback, useRef } from 'react';
import { Animated } from 'react-native';

/**
 * Press feedback driven from the Pressable itself. The Pressable stays the
 * parent and the Animated.View lives inside it, which is the arrangement that
 * keeps onPress alive on Android release builds.
 */
export function usePressScale(pressed = 0.95) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = useCallback(() => {
    Animated.spring(scale, {
      toValue: pressed,
      tension: 300,
      friction: 12,
      useNativeDriver: true,
    }).start();
  }, [pressed, scale]);

  const onPressOut = useCallback(() => {
    Animated.spring(scale, {
      toValue: 1,
      tension: 300,
      friction: 12,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  return { scale, onPressIn, onPressOut };
}

export default usePressScale;
