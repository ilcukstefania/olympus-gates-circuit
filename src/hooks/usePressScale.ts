import {useCallback, useRef} from 'react';
import {Animated} from 'react-native';
import {PRESS_SPRING} from '../constants/config';

/**
 * Rule #8 press-feedback: the <Pressable> is the PARENT and drives this spring;
 * the <Animated.View> carrying transform:[{scale}] sits INSIDE it.
 * transform only, so useNativeDriver is safe.
 */
export function usePressScale(to = 0.96) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = useCallback(() => {
    Animated.spring(scale, {
      toValue: to,
      ...PRESS_SPRING,
      useNativeDriver: true,
    }).start();
  }, [scale, to]);

  const onPressOut = useCallback(() => {
    Animated.spring(scale, {
      toValue: 1,
      ...PRESS_SPRING,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  return {scale, onPressIn, onPressOut};
}
