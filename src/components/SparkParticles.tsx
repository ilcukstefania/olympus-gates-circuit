import React, {useEffect, useMemo, useRef} from 'react';
import {Animated, Easing, StyleSheet, View} from 'react-native';
import {SCREEN_W} from '../constants/config';
import {THEME} from '../constants/theme';

interface Props {
  active: boolean;
  count?: number;
}

function SparkParticlesBase({active, count = 18}: Props) {
  const specs = useMemo(
    () =>
      Array.from({length: count}, (_, i) => ({
        id: i,
        x: 14 + ((i * 97) % Math.max(1, SCREEN_W - 28)),
        rise: 260 + ((i * 53) % 160),
        size: i % 3 === 0 ? 6 : 4,
        colour:
          i % 2 === 0 ? THEME.conduit.gold : THEME.conduit.cyan,
        delay: i * 40,
      })),
    [count],
  );

  const drivers = useRef(specs.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    if (!active) {
      return;
    }
    const anims = specs.map((s, i) =>
      Animated.sequence([
        Animated.delay(s.delay),
        Animated.timing(drivers[i], {
          toValue: 1,
          duration: 1600,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true, // transform + opacity only
        }),
      ]),
    );
    const group = Animated.parallel(anims);
    group.start();
    return () => group.stop();
  }, [active, specs, drivers]);

  if (!active) {
    return null;
  }

  return (
    <View pointerEvents="none" style={styles.layer}>
      {specs.map((s, i) => (
        <Animated.View
          key={s.id}
          pointerEvents="none"
          style={[
            styles.spark,
            {
              left: s.x,
              width: s.size,
              height: s.size,
              borderRadius: s.size / 2,
              backgroundColor: s.colour,
              opacity: drivers[i].interpolate({
                inputRange: [0, 0.2, 1],
                outputRange: [0, 1, 0],
              }),
              transform: [
                {
                  translateY: drivers[i].interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -s.rise],
                  }),
                },
                {
                  rotate: drivers[i].interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '180deg'],
                  }),
                },
              ],
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  layer: {...StyleSheet.absoluteFillObject},
  spark: {position: 'absolute', bottom: 0},
});

export const SparkParticles = React.memo(SparkParticlesBase);
