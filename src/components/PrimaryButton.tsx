import React from 'react';
import {Animated, Pressable, StyleSheet, Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import type {LucideIcon} from 'lucide-react-native';
import {C, THEME} from '../constants/theme';
import {usePressScale} from '../hooks/usePressScale';

interface Props {
  label: string;
  Icon: LucideIcon;
  onPress: () => void;
  height?: 56 | 60;
  variant?: 'cta' | 'charge';
  disabled?: boolean;
  flex?: boolean;
}

const ICON = 24; // rule #20 - fixed square, label lineHeight matches

/**
 * Rule #8 / #20: Pressable is the PARENT, the Animated.View scale wrapper sits
 * INSIDE it and carries pointerEvents="box-none" so taps always reach through.
 */
function PrimaryButtonBase({
  label,
  Icon,
  onPress,
  height = 60,
  variant = 'cta',
  disabled = false,
  flex = false,
}: Props) {
  const {scale, onPressIn, onPressOut} = usePressScale();
  const charge = variant === 'charge';
  const colors = charge
    ? [...THEME.gradients.charge]
    : [...THEME.gradients.cta];
  const fg = charge ? C.onGold : C.onAccent;
  const glow = charge ? C.accentSecondary : C.accentPrimary;

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      onPressIn={disabled ? undefined : onPressIn}
      onPressOut={disabled ? undefined : onPressOut}
      hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}
      style={[
        styles.hit,
        flex ? styles.flexHit : styles.fullHit,
        {height, opacity: disabled ? 0.4 : 1},
      ]}>
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.wrap,
          {
            height,
            borderRadius: height >= 60 ? 18 : 16,
            shadowColor: glow,
            transform: [{scale}],
          },
        ]}>
        <LinearGradient
          colors={colors}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={[styles.fill, {borderRadius: height >= 60 ? 18 : 16}]}
        />
        <View style={styles.row}>
          <Icon size={ICON} color={fg} strokeWidth={2.6} />
          <Text style={[styles.label, {color: fg}]} numberOfLines={1}>
            {label}
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  hit: {justifyContent: 'center'},
  fullHit: {width: '100%'},
  flexHit: {flex: 1},
  wrap: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowOpacity: 0.5,
    shadowRadius: 18,
    shadowOffset: {width: 0, height: 8},
    elevation: 12,
  },
  fill: {...StyleSheet.absoluteFillObject},
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  label: {
    fontSize: 17,
    lineHeight: ICON,
    fontWeight: '900',
    letterSpacing: 2.2,
  },
});

export const PrimaryButton = React.memo(PrimaryButtonBase);
