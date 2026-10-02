import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import theme from '../constants/theme';

interface Props {
  value: string;
  label: string;
  accent: string;
}

/**
 * Deliberately raster-free: a coloured dot carries the semantics, the number
 * carries the information. Three differently-shaped PNG sprites in one row can
 * never look the same size, a dot always does.
 */
export function StatCard({ value, label, accent }: Props) {
  return (
    <View style={[styles.card, { borderColor: accent + '55' }]}>
      <View style={[styles.dot, { backgroundColor: accent }]} />
      <Text style={[styles.value, { color: accent }]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: 'center',
    backgroundColor: 'rgba(245,239,229,0.055)',
    borderWidth: 1,
    borderRadius: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  value: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 1,
    fontVariant: ['tabular-nums'],
  },
  label: {
    marginTop: 3,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: theme.colors.textMuted,
  },
});

export default StatCard;
