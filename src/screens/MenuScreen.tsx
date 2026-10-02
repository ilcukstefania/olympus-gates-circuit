import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import Svg, { Line, Path, Polygon } from 'react-native-svg';
import { Star, Zap } from 'lucide-react-native';

import { bgMenu } from '../assets';
import AuroraBackdrop from '../components/AuroraBackdrop';
import IslandChip from '../components/IslandChip';
import PrimaryButton from '../components/PrimaryButton';
import ScreenHeader from '../components/ScreenHeader';
import StatCard from '../components/StatCard';
import { MAX_ISLANDS, MENU_AUTOSTART_MS } from '../constants/config';
import theme from '../constants/theme';
import type { IslandState } from '../components/IslandChip';

interface Props {
  island: number;
  islandsDone: number;
  totalStars: number;
  bestStars: number;
  onPlay: () => void;
}

const ISLANDS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

/** Module scope: the hand-over happens once per launch, never on a re-entry. */
let autoStarted = false;

function hexPts(cx: number, cy: number, w: number): string {
  const h = w * 1.1547;
  return [
    `${cx},${cy - h / 2}`,
    `${cx + w / 2},${cy - h / 4}`,
    `${cx + w / 2},${cy + h / 4}`,
    `${cx},${cy + h / 2}`,
    `${cx - w / 2},${cy + h / 4}`,
    `${cx - w / 2},${cy - h / 4}`,
  ].join(' ');
}

export function MenuScreen({
  island,
  islandsDone,
  totalStars,
  bestStars,
  onPlay,
}: Props) {
  const sheet = useRef(new Animated.Value(40)).current;
  const breath = useRef(new Animated.Value(1)).current;

  const playRef = useRef(onPlay);
  playRef.current = onPlay;

  /* Backstop: open the circuit by itself if nothing ever taps START. */
  useEffect(() => {
    if (autoStarted) {
      return;
    }
    const id = setTimeout(() => {
      autoStarted = true;
      playRef.current();
    }, MENU_AUTOSTART_MS);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    Animated.spring(sheet, {
      toValue: 0,
      tension: 50,
      friction: 9,
      useNativeDriver: true,
    }).start();

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(breath, {
          toValue: 1.03,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.timing(breath, {
          toValue: 1,
          duration: 1800,
          useNativeDriver: true,
        }),
      ]),
      { iterations: 1 },
    );
    loop.start();
    return () => loop.stop();
  }, [breath, sheet]);

  const stateFor = (n: number): IslandState => {
    if (n < island) {
      return 'done';
    }
    if (n === island) {
      return 'current';
    }
    return 'locked';
  };

  const progressRatio = Math.min(1, islandsDone / MAX_ISLANDS);

  return (
    <View style={styles.root}>
      <AuroraBackdrop variant="menu" image={bgMenu} imageOpacity={0.45} />

      <ScreenHeader
        title="SKY MAP"
        subtitle={`ISLAND ${island} / ${MAX_ISLANDS}`}
        leftSlot={
          <View style={styles.badge}>
            <Zap size={16} color={theme.colors.primary} strokeWidth={2.5} />
          </View>
        }
        rightSlot={
          <View style={styles.badge}>
            <Star
              size={16}
              color={theme.colors.secondary}
              fill={theme.colors.secondary}
              strokeWidth={2}
            />
            <Text style={styles.badgeNum}>{totalStars}</Text>
          </View>
        }
      />

      <View style={styles.art}>
        <Animated.View
          pointerEvents="none"
          style={{ transform: [{ scale: breath }] }}>
          <Svg width={300} height={190}>
            <Line
              x1={88}
              y1={104}
              x2={150}
              y2={92}
              stroke={theme.colors.violet}
              strokeWidth={10}
              opacity={0.25}
              strokeLinecap="round"
            />
            <Line
              x1={88}
              y1={104}
              x2={150}
              y2={92}
              stroke={theme.colors.violet}
              strokeWidth={4}
              strokeLinecap="round"
            />
            <Line
              x1={150}
              y1={92}
              x2={212}
              y2={104}
              stroke={theme.colors.primary}
              strokeWidth={10}
              opacity={0.25}
              strokeLinecap="round"
            />
            <Line
              x1={150}
              y1={92}
              x2={212}
              y2={104}
              stroke={theme.colors.primary}
              strokeWidth={4}
              strokeLinecap="round"
            />

            <Polygon
              points={hexPts(88, 104, 76)}
              fill="#1C2450"
              stroke={theme.colors.violet}
              strokeWidth={2.5}
            />
            <Polygon
              points={hexPts(212, 104, 76)}
              fill="#1C2450"
              stroke={theme.colors.primary}
              strokeWidth={2.5}
            />
            <Polygon
              points={hexPts(150, 92, 110)}
              fill="#19214C"
              stroke={theme.colors.secondary}
              strokeWidth={3}
            />
            <Path
              d="M157 54 L136 94 H151 L145 128 L170 86 H152 Z"
              stroke={theme.colors.primary}
              strokeWidth={9}
              strokeLinejoin="round"
              opacity={0.25}
              fill="none"
            />
            <Path
              d="M157 54 L136 94 H151 L145 128 L170 86 H152 Z"
              fill={theme.colors.primary}
            />
          </Svg>
        </Animated.View>
      </View>

      <Animated.View
        pointerEvents="box-none"
        style={[styles.sheet, { transform: [{ translateY: sheet }] }]}>
        <Text style={styles.brand}>OLYMPUS GATES</Text>
        <Text style={styles.brandSub}>CIRCUIT</Text>
        <Text style={styles.tagline}>ROTATE RUNES. LIGHT EVERY BEACON.</Text>

        <View style={styles.chipRow}>
          {ISLANDS.map(n => (
            <IslandChip key={n} index={n} state={stateFor(n)} />
          ))}
        </View>
        <View style={styles.track}>
          <View style={[styles.trackFill, { flex: Math.max(0.001, progressRatio) }]} />
          <View style={{ flex: Math.max(0.001, 1 - progressRatio) }} />
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statSlot}>
            <StatCard
              value={`${bestStars}`}
              label="BEST STARS"
              accent={theme.colors.secondary}
            />
          </View>
          <View style={styles.statSlot}>
            <StatCard
              value={`${islandsDone}`}
              label="CIRCUITS"
              accent={theme.colors.primary}
            />
          </View>
        </View>

        <Text style={styles.hint}>TAP A RUNE TO ROTATE IT</Text>

        <PrimaryButton
          label="START CIRCUIT"
          colors={theme.gradients.cta}
          Icon={Zap}
          onPress={onPlay}
          textColor={theme.colors.onAccent}
          shadowColor={theme.colors.primary}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  badge: {
    height: 36,
    minWidth: 36,
    paddingHorizontal: 9,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    backgroundColor: 'rgba(245,239,229,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(245,239,229,0.14)',
  },
  badgeNum: {
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    fontVariant: ['tabular-nums'],
  },
  art: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheet: {
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 28,
    backgroundColor: 'rgba(20,26,60,0.88)',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderTopWidth: 1,
    borderColor: 'rgba(245,239,229,0.14)',
    shadowColor: theme.colors.primary,
    shadowOpacity: 0.35,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: -8 },
    elevation: 18,
  },
  brand: {
    fontSize: 26,
    lineHeight: 32,
    fontWeight: '900',
    letterSpacing: 2,
    color: theme.colors.textPrimary,
  },
  brandSub: {
    fontSize: 18,
    lineHeight: 23,
    fontWeight: '800',
    letterSpacing: 6,
    color: theme.colors.secondary,
  },
  tagline: {
    marginTop: 6,
    marginBottom: 14,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    letterSpacing: 1,
    color: theme.colors.textSecondary,
  },
  chipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  track: {
    marginTop: 10,
    height: 4,
    borderRadius: 2,
    flexDirection: 'row',
    overflow: 'hidden',
    backgroundColor: 'rgba(245,239,229,0.10)',
  },
  trackFill: {
    backgroundColor: theme.colors.primary,
    borderRadius: 2,
  },
  statsRow: {
    marginTop: 16,
    flexDirection: 'row',
    gap: 12,
  },
  statSlot: {
    flex: 1,
  },
  hint: {
    marginTop: 16,
    marginBottom: 10,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '700',
    letterSpacing: 1.5,
    textAlign: 'center',
    color: theme.colors.textMuted,
  },
});

export default MenuScreen;
