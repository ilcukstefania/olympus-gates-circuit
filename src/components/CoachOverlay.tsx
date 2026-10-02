import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { COACH_AUTOCLOSE_MS } from '../constants/config';
import theme from '../constants/theme';
import LightningMark from './LightningMark';

interface Props {
  onDone: () => void;
}

const STEPS = ['TAP A RUNE TO ROTATE IT', 'LINK EVERY SOURCE TO ITS BEACON'];

/**
 * Two-beat coaching card. It closes on tap and, crucially, closes itself after
 * COACH_AUTOCLOSE_MS so it can never hold the screen hostage.
 */
export function CoachOverlay({ onDone }: Props) {
  const [step, setStep] = useState(0);
  const fade = useRef(new Animated.Value(0)).current;
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    Animated.timing(fade, {
      toValue: 1,
      duration: 240,
      useNativeDriver: true,
    }).start();
    const t = setTimeout(() => doneRef.current(), COACH_AUTOCLOSE_MS);
    return () => clearTimeout(t);
  }, [fade]);

  const advance = useCallback(() => {
    setStep(s => {
      if (s + 1 >= STEPS.length) {
        doneRef.current();
        return s;
      }
      return s + 1;
    });
  }, []);

  return (
    <Pressable
      style={styles.backdrop}
      onPress={advance}
      accessibilityRole="button"
      accessibilityLabel="GOT IT">
      <Animated.View
        pointerEvents="box-none"
        style={[styles.card, { opacity: fade }]}>
        <View style={styles.mark}>
          <LightningMark size={34} color={theme.colors.primary} />
        </View>
        <Text style={styles.title}>HOW TO PLAY</Text>
        <Text style={styles.body}>{STEPS[step]}</Text>
        <View style={styles.cta}>
          <Text style={styles.ctaText}>GOT IT</Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(4,6,15,0.72)',
  },
  card: {
    width: 300,
    paddingVertical: 22,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.secondary,
    shadowColor: theme.colors.primary,
    shadowOpacity: 0.4,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 24,
  },
  mark: {
    marginBottom: 10,
  },
  title: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '800',
    letterSpacing: 3,
    color: theme.colors.textMuted,
  },
  body: {
    marginTop: 10,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '800',
    letterSpacing: 1,
    textAlign: 'center',
    color: theme.colors.textPrimary,
  },
  cta: {
    marginTop: 18,
    height: 48,
    paddingHorizontal: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(57,199,255,0.14)',
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  ctaText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '900',
    letterSpacing: 3,
    color: theme.colors.primary,
  },
});

export default CoachOverlay;
