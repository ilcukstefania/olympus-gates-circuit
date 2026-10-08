import React, {useEffect, useRef} from 'react';
import {Animated, StyleSheet, View} from 'react-native';
import {MAX_OVERLOADS} from '../constants/config';
import {C} from '../constants/theme';

interface Props {
  used: number;
}

const SLOTS = Array.from({length: MAX_OVERLOADS}, (_, i) => i);

function OverloadPipsBase({used}: Props) {
  const pops = useRef(SLOTS.map(() => new Animated.Value(1))).current;
  const prev = useRef(0);

  useEffect(() => {
    const idx = used - 1;
    if (used > prev.current && idx >= 0 && idx < pops.length) {
      pops[idx].setValue(1);
      Animated.sequence([
        Animated.timing(pops[idx], {
          toValue: 1.5,
          duration: 130,
          useNativeDriver: true,
        }),
        Animated.spring(pops[idx], {
          toValue: 1,
          tension: 180,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();
    }
    prev.current = used;
  }, [used, pops]);

  return (
    <View style={styles.row}>
      {SLOTS.map(i => {
        const on = i < used;
        return (
          <Animated.View
            key={i}
            pointerEvents="none"
            style={[
              styles.pip,
              on ? styles.pipOn : styles.pipOff,
              {transform: [{scale: pops[i]}]},
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {flexDirection: 'row', alignItems: 'center', gap: 5},
  pip: {width: 9, height: 9, borderRadius: 5},
  pipOff: {backgroundColor: 'rgba(245,239,229,0.22)'},
  pipOn: {
    backgroundColor: C.danger,
    shadowColor: C.danger,
    shadowOpacity: 0.8,
    shadowRadius: 6,
    shadowOffset: {width: 0, height: 0},
    elevation: 6,
  },
});

export const OverloadPips = React.memo(OverloadPipsBase);
