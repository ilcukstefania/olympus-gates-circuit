import React from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import type { ColorValue } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { usePressScale } from '../hooks/usePressScale';

/** Structural shape of a lucide icon — kept local so the button never has to
 *  import the icon library's own types. */
type IconComponent = React.ComponentType<{
  size?: number | string;
  color?: ColorValue;
  strokeWidth?: number | string;
}>;

interface Props {
  label: string;
  colors: string[];
  onPress: () => void;
  Icon?: IconComponent;
  textColor?: string;
  shadowColor?: string;
}

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

export function PrimaryButton({
  label,
  colors,
  onPress,
  Icon,
  textColor = '#071027',
  shadowColor = '#39C7FF',
}: Props) {
  const { scale, onPressIn, onPressOut } = usePressScale(0.95);

  return (
    <Pressable
      style={[styles.press, { shadowColor }]}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      hitSlop={HIT}
      accessibilityRole="button"
      accessibilityLabel={label}>
      <Animated.View
        pointerEvents="box-none"
        style={[styles.anim, { transform: [{ scale }] }]}>
        <LinearGradient
          colors={colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.grad}>
          <View style={styles.row}>
            {Icon ? <Icon size={24} color={textColor} strokeWidth={2.5} /> : null}
            <Text style={[styles.label, { color: textColor }]}>{label}</Text>
          </View>
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: {
    width: '100%',
    height: 60,
    borderRadius: 18,
    shadowOpacity: 0.55,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 14,
  },
  anim: {
    width: '100%',
    height: 60,
    borderRadius: 18,
    overflow: 'hidden',
  },
  grad: {
    width: '100%',
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  label: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '900',
    letterSpacing: 3,
  },
});

export default PrimaryButton;
