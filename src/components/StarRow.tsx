import React, {useEffect, useRef} from 'react';
import {Animated, StyleSheet, View} from 'react-native';
import {Star} from 'lucide-react-native';
import {POP_SPRING} from '../constants/config';
import {C} from '../constants/theme';

interface Props {
  earned: number;
  size?: 'small' | 'large';
  animated?: boolean;
}

const SLOTS = [0, 1, 2];

function StarRowBase({earned, size = 'small', animated = false}: Props) {
  const large = size === 'large';
  const glyph = large ? 40 : 14;
  const pops = useRef(SLOTS.map(() => new Animated.Value(animated ? 0 : 1)))
    .current;

  useEffect(() => {
    if (!animated) {
      return;
    }
    const anims = SLOTS.map((_, i) =>
      Animated.sequence([
        Animated.delay(i * 140),
        Animated.spring(pops[i], {
          toValue: 1,
          ...POP_SPRING,
          useNativeDriver: true, // transform only
        }),
      ]),
    );
    const group = Animated.parallel(anims);
    group.start();
    return () => group.stop();
  }, [animated, pops, earned]);

  return (
    <View style={[styles.row, large ? styles.rowLarge : styles.rowSmall]}>
      {SLOTS.map(i => {
        const on = i < earned;
        return (
          <Animated.View
            key={i}
            pointerEvents="none"
            style={{
              transform: [
                {
                  scale: on
                    ? pops[i].interpolate({
                        inputRange: [0, 0.6, 1],
                        outputRange: [0, 1.25, 1],
                      })
                    : 1,
                },
              ],
            }}>
            <Star
              size={glyph}
              color={on ? C.accentSecondary : 'rgba(245,239,229,0.22)'}
              fill={on ? C.accentSecondary : 'transparent'}
              strokeWidth={2}
            />
          </Animated.View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {flexDirection: 'row', alignItems: 'center'},
  rowSmall: {gap: 4},
  rowLarge: {gap: 14},
});

export const StarRow = React.memo(StarRowBase);
