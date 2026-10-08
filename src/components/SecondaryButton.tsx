import React from 'react';
import {Animated, Pressable, StyleSheet, Text, View} from 'react-native';
import type {LucideIcon} from 'lucide-react-native';
import {C} from '../constants/theme';
import {usePressScale} from '../hooks/usePressScale';

interface Props {
  label: string;
  Icon: LucideIcon;
  onPress: () => void;
  accent?: string;
  flex?: boolean;
}

const ICON = 24; // same icon size as PrimaryButton - rule #20

function SecondaryButtonBase({
  label,
  Icon,
  onPress,
  accent = C.glassBorder,
  flex = true,
}: Props) {
  const {scale, onPressIn, onPressOut} = usePressScale();

  return (
    <Pressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}
      style={[styles.hit, flex ? styles.flexHit : styles.fullHit]}>
      <Animated.View
        pointerEvents="box-none"
        style={[styles.wrap, {borderColor: accent, transform: [{scale}]}]}>
        <View style={styles.row}>
          <Icon size={ICON} color={C.textPrimary} strokeWidth={2.2} />
          <Text style={styles.label} numberOfLines={1}>
            {label}
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  hit: {height: 48, justifyContent: 'center'},
  flexHit: {flex: 1},
  fullHit: {width: '100%'},
  wrap: {
    width: '100%',
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: C.glassFill,
    borderWidth: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  label: {
    fontSize: 13,
    lineHeight: ICON,
    fontWeight: '800',
    letterSpacing: 1.6,
    color: C.textPrimary,
  },
});

export const SecondaryButton = React.memo(SecondaryButtonBase);
