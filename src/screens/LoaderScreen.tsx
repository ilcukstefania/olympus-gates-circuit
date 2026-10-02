import React, { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Path, Polygon } from 'react-native-svg';

import { bgLoader } from '../assets';
import {
  LOADER_BAR_ANIM_MS,
  LOADER_DURATION_MS,
  SCREEN_H,
  SCREEN_W,
} from '../constants/config';
import theme from '../constants/theme';

interface Props {
  onDone: () => void;
}

const PROGRESS_W = 220;
const HEX_W = 132;
const HEX_H = 152;

interface Speck {
  x: number;
  y: number;
  r: number;
  o: number;
  big: boolean;
}

/** Deterministic speck field — fills the whole canvas, no RNG at mount. */
const SPECKS: Speck[] = [];
for (let i = 1; i <= 96; i += 1) {
  const big = i % 8 === 0;
  SPECKS.push({
    x: Math.round((((i * 73) % 100) / 100) * (SCREEN_W - 6)),
    y: Math.round((((i * 131) % 100) / 100) * (SCREEN_H - 6)),
    r: big ? 4 : 1.5 + ((i * 37) % 3) * 0.5,
    o: big ? 0.5 : 0.18 + ((i * 17) % 4) * 0.08,
    big,
  });
}

const HEX_POINTS = [
  `${HEX_W / 2},0`,
  `${HEX_W},${HEX_H / 4}`,
  `${HEX_W},${(HEX_H * 3) / 4}`,
  `${HEX_W / 2},${HEX_H}`,
  `0,${(HEX_H * 3) / 4}`,
  `0,${HEX_H / 4}`,
].join(' ');

const BOLT_D = 'M74 38 L50 84 H68 L62 118 L90 70 H70 Z';

export function LoaderScreen({ onDone }: Props) {
  const rise = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0.55)).current;
  const halo = useRef(new Animated.Value(1)).current;
  const progress = useRef(new Animated.Value(0)).current;

  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(rise, {
        toValue: 1,
        tension: 40,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(progress, {
        toValue: 1,
        duration: LOADER_BAR_ANIM_MS,
        useNativeDriver: false,
      }),
    ]).start();

    const flicker = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0.55,
          duration: 900,
          useNativeDriver: true,
        }),
      ]),
      { iterations: 1 },
    );
    flicker.start();

    const breathe = Animated.loop(
      Animated.sequence([
        Animated.timing(halo, {
          toValue: 1.06,
          duration: 1400,
          useNativeDriver: true,
        }),
        Animated.timing(halo, {
          toValue: 1,
          duration: 1400,
          useNativeDriver: true,
        }),
      ]),
      { iterations: 1 },
    );
    breathe.start();

    const timer = setTimeout(() => doneRef.current(), LOADER_DURATION_MS);
    return () => {
      clearTimeout(timer);
      flicker.stop();
      breathe.stop();
    };
  }, [halo, progress, pulse, rise]);

  const barFill = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, PROGRESS_W],
  });

  return (
    <View style={styles.root}>
      <Image source={bgLoader} resizeMode="cover" style={styles.plate} />
      <LinearGradient
        colors={theme.gradients.loader}
        locations={[0, 0.55, 1]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={[StyleSheet.absoluteFill, styles.veil]}
      />

      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        {SPECKS.map((s, i) => (
          <View
            key={i}
            style={[
              styles.speck,
              {
                left: s.x,
                top: s.y,
                width: s.r * 2,
                height: s.r * 2,
                borderRadius: s.r,
                opacity: s.o,
                backgroundColor: s.big ? theme.colors.primary : '#F5EFE5',
              },
            ]}
          />
        ))}
      </View>

      <View style={styles.center}>
        <Animated.View
          pointerEvents="none"
          style={[styles.halo, { transform: [{ scale: halo }] }]}
        />
        <View pointerEvents="none" style={styles.haloMid} />
        <View pointerEvents="none" style={styles.haloInner} />

        <Animated.View
          pointerEvents="none"
          style={{ opacity: rise, transform: [{ scale: rise }] }}>
          <Svg width={HEX_W} height={HEX_H}>
            <Polygon
              points={HEX_POINTS}
              fill="#1C2450"
              stroke={theme.colors.secondary}
              strokeWidth={3}
            />
            <Path
              d={BOLT_D}
              stroke={theme.colors.primary}
              strokeWidth={9}
              strokeLinejoin="round"
              opacity={0.25}
              fill="none"
            />
            <Path d={BOLT_D} fill={theme.colors.primary} />
          </Svg>
        </Animated.View>

        <Animated.View pointerEvents="none" style={{ opacity: pulse }}>
          <Text style={styles.brand}>OLYMPUS GATES</Text>
        </Animated.View>
        <Text style={styles.brandSub}>CIRCUIT</Text>
        <Text style={styles.tagline}>LINK THE SKY</Text>

        <View style={styles.barTrack}>
          <Animated.View pointerEvents="none" style={{ width: barFill }}>
            <LinearGradient
              colors={theme.gradients.progress}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.barFill}
            />
          </Animated.View>
        </View>
        <Text style={styles.loading}>LOADING...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.bgDeep,
  },
  plate: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  },
  veil: {
    opacity: 0.9,
  },
  speck: {
    position: 'absolute',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  halo: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    borderWidth: 1,
    borderColor: 'rgba(57,199,255,0.10)',
  },
  haloMid: {
    position: 'absolute',
    width: 230,
    height: 230,
    borderRadius: 115,
    borderWidth: 1,
    borderColor: 'rgba(57,199,255,0.16)',
  },
  haloInner: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 1,
    borderColor: 'rgba(57,199,255,0.24)',
  },
  brand: {
    marginTop: 26,
    fontSize: 34,
    lineHeight: 42,
    fontWeight: '900',
    letterSpacing: 5,
    color: theme.colors.textPrimary,
    textShadowColor: 'rgba(57,199,255,0.55)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 14,
  },
  brandSub: {
    marginTop: 2,
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '700',
    letterSpacing: 10,
    color: theme.colors.secondary,
  },
  tagline: {
    marginTop: 14,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    letterSpacing: 3,
    color: 'rgba(245,239,229,0.55)',
  },
  barTrack: {
    marginTop: 34,
    width: PROGRESS_W,
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    backgroundColor: 'rgba(245,239,229,0.12)',
  },
  barFill: {
    height: 6,
    borderRadius: 3,
  },
  loading: {
    marginTop: 12,
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 4,
    color: 'rgba(245,239,229,0.40)',
  },
});

export default LoaderScreen;
