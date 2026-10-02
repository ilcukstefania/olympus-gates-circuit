import React from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';

import theme from '../constants/theme';
import { usePressScale } from '../hooks/usePressScale';

interface Props {
  title: string;
  subtitle: string;
  subtitleColor?: string;
  onBack?: () => void;
  rightSlot?: React.ReactNode;
  leftSlot?: React.ReactNode;
}

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

function BackButton({ onPress }: { onPress: () => void }) {
  const { scale, onPressIn, onPressOut } = usePressScale(0.9);
  return (
    <Pressable
      style={styles.circleBtn}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      hitSlop={HIT}
      accessibilityRole="button"
      accessibilityLabel="Back">
      <Animated.View
        pointerEvents="box-none"
        style={[styles.circleFace, { transform: [{ scale }] }]}>
        <ArrowLeft size={24} color={theme.colors.textPrimary} strokeWidth={2.2} />
      </Animated.View>
    </Pressable>
  );
}

/**
 * One header for every screen. Slots change, the chrome never does — that is
 * what keeps the three screens reading as the same app.
 */
export function ScreenHeader({
  title,
  subtitle,
  subtitleColor,
  onBack,
  rightSlot,
  leftSlot,
}: Props) {
  return (
    <View style={styles.header}>
      <View style={styles.side}>
        {onBack ? <BackButton onPress={onBack} /> : leftSlot}
      </View>

      <View style={styles.center}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <Text
          style={[styles.subtitle, subtitleColor ? { color: subtitleColor } : null]}
          numberOfLines={1}>
          {subtitle}
        </Text>
      </View>

      <View style={styles.sideRight}>{rightSlot}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 44,
    height: 116,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: 'rgba(9,13,36,0.55)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(245,239,229,0.10)',
  },
  side: {
    width: 76,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  sideRight: {
    width: 76,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '800',
    letterSpacing: 3,
    color: theme.colors.textPrimary,
  },
  subtitle: {
    marginTop: 2,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: theme.colors.secondary,
  },
  circleBtn: {
    width: 44,
    height: 44,
  },
  circleFace: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(245,239,229,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(245,239,229,0.14)',
  },
});

export default ScreenHeader;
