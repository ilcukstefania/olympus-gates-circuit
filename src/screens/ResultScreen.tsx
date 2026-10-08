import React, {useEffect, useMemo, useRef} from 'react';
import {Animated, Image, StyleSheet, Text, View} from 'react-native';
import Svg, {Polygon} from 'react-native-svg';
import {ChevronRight, Home, Map as MapIcon, RotateCcw} from 'lucide-react-native';
import {ART} from '../assets';
import {PrimaryButton} from '../components/PrimaryButton';
import {ScreenBackground} from '../components/ScreenBackground';
import {SecondaryButton} from '../components/SecondaryButton';
import {SparkParticles} from '../components/SparkParticles';
import {StarRow} from '../components/StarRow';
import {StatRow} from '../components/StatRow';
import type {PillSpec} from '../components/StatPill';
import {HEADER_PAD_TOP} from '../constants/config';
import {C, THEME} from '../constants/theme';
import {hexPoints} from '../game/hexGrid';
import {ISLAND_COUNT} from '../game/levels';
import type {Outcome} from '../game/types';

export interface RoundSummary {
  outcome: Outcome;
  islandIndex: number;
  islandName: string;
  moves: number;
  moveLimit: number;
  beaconsLit: number;
  beaconCount: number;
  overloads: number;
  stars: 0 | 1 | 2 | 3;
}

interface Props {
  summary: RoundSummary;
  onPlayAgain: () => void;
  onNextIsland: () => void;
  onMap: () => void;
  onMenu: () => void;
}

const MEDAL = 150;
const RING = 104;
const MEDAL_HEX = hexPoints(MEDAL, MEDAL, 3);
const RING_HEX = hexPoints(RING, RING, 3);

export function ResultScreen({
  summary,
  onPlayAgain,
  onNextIsland,
  onMap,
  onMenu,
}: Props) {
  const win = summary.outcome === 'win';
  const enter = useRef(new Animated.Value(0)).current;
  const hasNext = win && summary.islandIndex + 1 < ISLAND_COUNT;

  useEffect(() => {
    Animated.spring(enter, {
      toValue: 1,
      tension: 52,
      friction: 9,
      useNativeDriver: true,
    }).start();
  }, [enter]);

  const pills = useMemo<PillSpec[]>(
    () => [
      {
        key: 'moves',
        value: summary.moves + '/' + summary.moveLimit,
        label: 'MOVES USED',
        accent: THEME.conduit.cyan,
      },
      win
        ? {
            key: 'beacons',
            value: summary.beaconsLit + '/' + summary.beaconCount,
            label: 'BEACONS LIT',
            accent: THEME.conduit.gold,
          }
        : {
            key: 'overloads',
            value: String(summary.overloads),
            label: 'OVERLOADS',
            accent: C.danger,
          },
    ],
    [
      win,
      summary.moves,
      summary.moveLimit,
      summary.beaconsLit,
      summary.beaconCount,
      summary.overloads,
    ],
  );

  return (
    <ScreenBackground variant={win ? 'result-win' : 'result-lose'}>
      <View style={styles.root}>
        <Animated.View
          pointerEvents="box-none"
          style={[
            styles.column,
            {
              opacity: enter,
              transform: [
                {
                  translateY: enter.interpolate({
                    inputRange: [0, 1],
                    outputRange: [24, 0],
                  }),
                },
              ],
            },
          ]}>
          {/* rule #17: the ornamental ring sits ABOVE the heading box, never
              across the letters */}
          <View pointerEvents="none" style={styles.ringWrap}>
            <Svg width={RING} height={RING}>
              <Polygon
                points={RING_HEX}
                fill="transparent"
                stroke={win ? C.accentSecondary : C.danger}
                strokeWidth={1.6}
                strokeOpacity={0.4}
              />
            </Svg>
            <Image
              source={win ? ART.spriteBeacon : ART.spriteBolt}
              style={styles.ringSprite}
              resizeMode="contain"
            />
          </View>

          <Text
            style={[styles.verdict, win ? styles.verdictWin : styles.verdictLose]}>
            {win ? 'CIRCUIT COMPLETE' : 'GATES CLOSED'}
          </Text>
          <Text style={styles.island}>{summary.islandName}</Text>

          <View style={styles.medallion}>
            <Svg width={MEDAL} height={MEDAL}>
              <Polygon
                points={MEDAL_HEX}
                fill={win ? 'rgba(57,199,255,0.08)' : 'rgba(232,74,95,0.08)'}
                stroke={win ? C.accentPrimary : C.danger}
                strokeWidth={2}
              />
            </Svg>
            <View pointerEvents="none" style={styles.starsInMedal}>
              <StarRow earned={summary.stars} size="large" animated />
            </View>
          </View>

          <View style={styles.statsWrap}>
            <StatRow pills={pills} />
          </View>

          <View style={styles.ctaWrap}>
            <PrimaryButton
              label="PLAY AGAIN"
              Icon={RotateCcw}
              onPress={onPlayAgain}
              height={60}
            />
            <View style={styles.secondaryRow}>
              {hasNext ? (
                <SecondaryButton
                  label="NEXT ISLAND"
                  Icon={ChevronRight}
                  onPress={onNextIsland}
                  accent="rgba(243,197,76,0.45)"
                />
              ) : (
                <SecondaryButton label="MAIN MENU" Icon={Home} onPress={onMenu} />
              )}
              <SecondaryButton label="ISLAND MAP" Icon={MapIcon} onPress={onMap} />
            </View>
          </View>
        </Animated.View>

        <SparkParticles active={win} count={18} />
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1},
  column: {
    flex: 1,
    paddingTop: HEADER_PAD_TOP + 10,
    paddingHorizontal: 24,
    paddingBottom: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringWrap: {
    width: RING,
    height: RING,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  ringSprite: {position: 'absolute', width: 58, height: 58},
  verdict: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '900',
    letterSpacing: 3,
    textAlign: 'center',
    textShadowRadius: 16,
    textShadowOffset: {width: 0, height: 0},
  },
  verdictWin: {
    color: C.textPrimary,
    textShadowColor: 'rgba(243,197,76,0.55)',
  },
  verdictLose: {
    color: C.danger,
    textShadowColor: 'rgba(232,74,95,0.5)',
  },
  island: {
    marginTop: 8,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '700',
    letterSpacing: 2.2,
    color: C.textSecondary,
  },
  medallion: {
    width: MEDAL,
    height: MEDAL,
    marginTop: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  starsInMedal: {position: 'absolute'},
  statsWrap: {marginTop: 20, width: '100%'},
  ctaWrap: {marginTop: 24, width: '100%'},
  secondaryRow: {marginTop: 12, flexDirection: 'row', gap: 10},
});
