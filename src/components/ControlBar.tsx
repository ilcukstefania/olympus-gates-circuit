import React from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Undo2, Zap } from 'lucide-react-native';

import {
  CONTROL_BAR_BOTTOM,
  CONTROL_BAR_H,
} from '../constants/config';
import theme, { CHANNEL_COLORS } from '../constants/theme';
import { usePressScale } from '../hooks/usePressScale';
import { CHANNELS } from '../game/types';
import type { Channel } from '../game/types';

interface Props {
  undoLeft: number;
  lit: Record<Channel, boolean>;
  onUndo: () => void;
  onCharge: () => void;
}

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

export function ControlBar({ undoLeft, lit, onUndo, onCharge }: Props) {
  const undoScale = usePressScale(0.92);
  const chargeScale = usePressScale(0.95);
  const canUndo = undoLeft > 0;

  return (
    <View style={styles.bar}>
      <Pressable
        style={styles.undoPress}
        onPress={onUndo}
        onPressIn={undoScale.onPressIn}
        onPressOut={undoScale.onPressOut}
        disabled={!canUndo}
        hitSlop={HIT}
        accessibilityRole="button"
        accessibilityLabel="Undo last turn">
        <Animated.View
          pointerEvents="box-none"
          style={[
            styles.undoFace,
            canUndo ? null : styles.faded,
            { transform: [{ scale: undoScale.scale }] },
          ]}>
          <Undo2 size={24} color={theme.colors.textPrimary} strokeWidth={2.2} />
          <Text style={styles.undoCount}>{undoLeft}</Text>
        </Animated.View>
      </Pressable>

      <View style={styles.beacons}>
        <View style={styles.dotRow}>
          {CHANNELS.map(ch => (
            <View
              key={ch}
              style={[
                styles.dot,
                {
                  backgroundColor: CHANNEL_COLORS[ch],
                  opacity: lit[ch] ? 1 : 0.25,
                },
                lit[ch] ? { shadowColor: CHANNEL_COLORS[ch] } : null,
                lit[ch] ? styles.dotGlow : null,
              ]}
            />
          ))}
        </View>
        <Text style={styles.beaconLabel}>BEACONS</Text>
      </View>

      <Pressable
        style={styles.chargePress}
        onPress={onCharge}
        onPressIn={chargeScale.onPressIn}
        onPressOut={chargeScale.onPressOut}
        hitSlop={HIT}
        accessibilityRole="button"
        accessibilityLabel="CHARGE">
        <Animated.View
          pointerEvents="box-none"
          style={[styles.chargeAnim, { transform: [{ scale: chargeScale.scale }] }]}>
          <LinearGradient
            colors={theme.gradients.charge}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.chargeFace}>
            <View style={styles.row}>
              <Zap size={24} color={theme.colors.bg} strokeWidth={2.5} />
              <Text style={styles.chargeLabel}>CHARGE</Text>
            </View>
          </LinearGradient>
        </Animated.View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    bottom: CONTROL_BAR_BOTTOM,
    left: 16,
    right: 16,
    height: CONTROL_BAR_H,
    borderRadius: 24,
    backgroundColor: 'rgba(12,17,48,0.92)',
    borderWidth: 1,
    borderColor: 'rgba(245,239,229,0.14)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 12,
    shadowColor: theme.colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 20,
  },
  undoPress: {
    width: 52,
    height: 52,
  },
  undoFace: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(245,239,229,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(245,239,229,0.16)',
  },
  faded: {
    opacity: 0.35,
  },
  undoCount: {
    marginTop: 1,
    fontSize: 11,
    lineHeight: 13,
    fontWeight: '800',
    color: theme.colors.secondary,
    fontVariant: ['tabular-nums'],
  },
  beacons: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  dotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  dotGlow: {
    shadowOpacity: 0.9,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },
  beaconLabel: {
    marginTop: 5,
    fontSize: 9,
    lineHeight: 11,
    fontWeight: '700',
    letterSpacing: 2,
    color: theme.colors.textMuted,
  },
  chargePress: {
    flex: 1,
    height: 52,
  },
  chargeAnim: {
    width: '100%',
    height: 52,
    borderRadius: 16,
    overflow: 'hidden',
  },
  chargeFace: {
    width: '100%',
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  chargeLabel: {
    fontSize: 15,
    lineHeight: 24,
    fontWeight: '900',
    letterSpacing: 2,
    color: theme.colors.bg,
  },
});

export default ControlBar;
