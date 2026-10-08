import React from 'react';
import {Animated, Pressable, StyleSheet, Text, View} from 'react-native';
import type {LucideIcon} from 'lucide-react-native';
import {C} from '../constants/theme';
import {usePressScale} from '../hooks/usePressScale';

interface Props {
  Icon: LucideIcon;
  onPress: () => void;
  size?: 40 | 44 | 48;
  disabled?: boolean;
  badge?: number;
  tint?: string;
  round?: boolean;
}

/** Glass square/circle button for back, settings, undo, reset. */
function IconButtonBase({
  Icon,
  onPress,
  size = 44,
  disabled = false,
  badge,
  tint = C.textPrimary,
  round = false,
}: Props) {
  const {scale, onPressIn, onPressOut} = usePressScale(0.92);

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      onPressIn={disabled ? undefined : onPressIn}
      onPressOut={disabled ? undefined : onPressOut}
      hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}
      style={[styles.hit, {width: size, height: size, opacity: disabled ? 0.35 : 1}]}>
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.box,
          {
            width: size,
            height: size,
            borderRadius: round ? size / 2 : 14,
            transform: [{scale}],
          },
        ]}>
        <Icon size={22} color={tint} strokeWidth={2} />
      </Animated.View>
      {badge !== undefined && badge > 0 ? (
        <View pointerEvents="none" style={styles.badge}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  hit: {alignItems: 'center', justifyContent: 'center'},
  box: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: C.glassFill,
    borderWidth: 1,
    borderColor: C.glassBorder,
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    minWidth: 16,
    height: 16,
    paddingHorizontal: 3,
    borderRadius: 8,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.accentSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 9,
    lineHeight: 11,
    fontWeight: '900',
    color: C.accentSecondary,
  },
});

export const IconButton = React.memo(IconButtonBase);
