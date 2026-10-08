import React from 'react';
import {Animated, StyleSheet, View} from 'react-native';
import {StatPill} from './StatPill';
import type {PillSpec} from './StatPill';

interface Props {
  pills: PillSpec[];
  stagger?: Animated.Value[];
}

/**
 * Rule #21: a lone pill looks orphaned, so the whole row is dropped when fewer
 * than two pills would be visible. Empty placeholder cards are never rendered.
 */
function StatRowBase({pills, stagger}: Props) {
  if (pills.length < 2) {
    return null;
  }
  return (
    <View style={styles.row}>
      {pills.map((p, i) => {
        const anim = stagger?.[i];
        return (
          <Animated.View
            key={p.key}
            pointerEvents="box-none"
            style={[
              styles.slot,
              anim
                ? {
                    opacity: anim,
                    transform: [
                      {
                        translateY: anim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [14, 0],
                        }),
                      },
                    ],
                  }
                : null,
            ]}>
            <StatPill value={p.value} label={p.label} accent={p.accent} />
          </Animated.View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {flexDirection: 'row', gap: 10},
  slot: {flex: 1},
});

export const StatRow = React.memo(StatRowBase);
