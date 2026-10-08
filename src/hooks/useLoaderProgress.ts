import {useEffect, useRef} from 'react';
import {Animated, Easing} from 'react-native';

/**
 * Drives the loader progress bar and fires `onDone` once.
 * The bar animates `width`, so useNativeDriver MUST stay false here.
 */
export function useLoaderProgress(
  durationMs: number,
  barWidth: number,
  onDone: () => void,
) {
  const progress = useRef(new Animated.Value(0)).current;
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    const anim = Animated.timing(progress, {
      toValue: barWidth,
      duration: Math.max(600, durationMs - 600),
      easing: Easing.inOut(Easing.quad),
      useNativeDriver: false, // width cannot run on the native driver
    });
    anim.start();

    const timer = setTimeout(() => doneRef.current(), durationMs);
    return () => {
      anim.stop();
      clearTimeout(timer);
    };
  }, [progress, durationMs, barWidth]);

  return progress;
}
