import React from 'react';
import { Animated, Pressable, StyleSheet, Text } from 'react-native';

import theme from '../constants/theme';
import { usePressScale } from '../hooks/usePressScale';

interface Props {
  label: string;
  onPress: () => void;
}

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

export function SecondaryButton({ label, onPress }: Props) {
  const { scale, onPressIn, onPressOut } = usePressScale(0.96);

  return (
    <Pressable
      style={styles.press}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      hitSlop={HIT}
      accessibilityRole="button"
      accessibilityLabel={label}>
      <Animated.View
        pointerEvents="box-none"
        style={[styles.anim, { transform: [{ scale }] }]}>
        <Text style={styles.label}>{label}</Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: {
    width: '100%',
    height: 48,
  },
  anim: {
    width: '100%',
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(245,239,229,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(245,239,229,0.18)',
  },
  label: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
    letterSpacing: 2,
    color: theme.colors.textPrimary,
  },
});

export default SecondaryButton;
