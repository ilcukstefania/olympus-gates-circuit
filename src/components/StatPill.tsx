import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {C} from '../constants/theme';

export interface PillSpec {
  key: string;
  value: string;
  label: string;
  accent: string;
}

/**
 * Rule #21: flat card, 8x8 accent dot, big tabular number, uppercase caption.
 * No AI sprites and no emoji - geometry stays predictable across pills.
 * Rule #19a: width:'100%' inside its flex:1 slot, never a second flex:1.
 */
function StatPillBase({value, label, accent}: Omit<PillSpec, 'key'>) {
  return (
    <View style={[styles.card, {borderColor: accent + '55'}]}>
      <View style={[styles.dot, {backgroundColor: accent}]} />
      <Text style={[styles.value, {color: accent}]} numberOfLines={1}>
        {value}
      </Text>
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(28,36,80,0.80)',
  },
  dot: {width: 8, height: 8, borderRadius: 4, marginBottom: 7},
  value: {
    fontSize: 22,
    lineHeight: 26,
    fontWeight: '900',
    fontVariant: ['tabular-nums'],
  },
  label: {
    marginTop: 2,
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '700',
    letterSpacing: 1.4,
    color: C.textMuted,
  },
});

export const StatPill = React.memo(StatPillBase);
