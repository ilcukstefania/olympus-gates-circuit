import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { Star } from 'lucide-react-native';

import theme from '../constants/theme';

interface Props {
  earned: number;
}

const SLOTS = [0, 1, 2];

export function StarRow({ earned }: Props) {
  const a0 = useRef(new Animated.Value(0)).current;
  const a1 = useRef(new Animated.Value(0)).current;
  const a2 = useRef(new Animated.Value(0)).current;
  const values = useRef([a0, a1, a2]).current;

  useEffect(() => {
    const anims = values.map((v, i) =>
      Animated.sequence([
        Animated.delay(140 * i),
        Animated.spring(v, {
          toValue: 1,
          tension: 60,
          friction: 7,
          useNativeDriver: true,
        }),
      ]),
    );
    Animated.parallel(anims).start();
  }, [values]);

  return (
    <View style={styles.row}>
      {SLOTS.map(i => {
        const on = i < earned;
        return (
          <Animated.View
            key={i}
            pointerEvents="none"
            style={[
              styles.slot,
              on ? styles.glow : null,
              { opacity: values[i], transform: [{ scale: values[i] }] },
            ]}>
            <Star
              size={34}
              color={on ? theme.colors.secondary : 'rgba(245,239,229,0.18)'}
              fill={on ? theme.colors.secondary : 'transparent'}
              strokeWidth={2}
            />
          </Animated.View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
  },
  slot: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    shadowColor: '#F3C54C',
    shadowOpacity: 0.8,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
    elevation: 10,
  },
});

export default StarRow;
