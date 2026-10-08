import React, {useEffect, useMemo, useRef} from 'react';
import {Animated, Easing, Image, StyleSheet, Text, View} from 'react-native';
import {GraduationCap, Map as MapIcon, Play, Settings} from 'lucide-react-native';
import {ART} from '../assets';
import {IconButton} from '../components/IconButton';
import {PrimaryButton} from '../components/PrimaryButton';
import {ScreenBackground} from '../components/ScreenBackground';
import {SecondaryButton} from '../components/SecondaryButton';
import {StatRow} from '../components/StatRow';
import type {PillSpec} from '../components/StatPill';
import {HEADER_PAD_TOP, SHEET_SPRING} from '../constants/config';
import {C, THEME} from '../constants/theme';
import {ISLAND_COUNT} from '../game/levels';
import {menuStats} from '../game/scoring';

interface Props {
  onPlay: () => void;
  onMap: () => void;
  onTutorial: () => void;
}

const SPARKS = [
  {left: 54, top: 40, duration: 2600, delay: 0},
  {left: 206, top: 104, duration: 3400, delay: 500},
  {left: 126, top: 168, duration: 4100, delay: 1100},
];

export function MenuScreen({onPlay, onMap, onTutorial}: Props) {
  const sheet = useRef(new Animated.Value(0)).current;
  const pillAnims = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;
  const sparkAnims = useRef(SPARKS.map(() => new Animated.Value(0))).current;

  const stats = menuStats();

  const pills = useMemo<PillSpec[]>(() => {
    const list: PillSpec[] = [
      {
        key: 'islands',
        value: stats.islandsCleared + '/' + ISLAND_COUNT,
        label: 'ISLANDS',
        accent: THEME.conduit.cyan,
      },
      {
        key: 'stars',
        value: stats.totalStars + '/' + ISLAND_COUNT * 3,
        label: 'STARS',
        accent: THEME.conduit.gold,
      },
    ];
    if (stats.bestMoves > 0) {
      list.push({
        key: 'best',
        value: String(stats.bestMoves),
        label: 'BEST MOVES',
        accent: THEME.conduit.violet,
      });
    }
    return list;
  }, [stats.islandsCleared, stats.totalStars, stats.bestMoves]);

  useEffect(() => {
    Animated.spring(sheet, {
      toValue: 1,
      ...SHEET_SPRING,
      useNativeDriver: true,
    }).start();

    const stagger = Animated.parallel(
      pillAnims.map((v, i) =>
        Animated.sequence([
          Animated.delay(160 + i * 70),
          Animated.timing(v, {
            toValue: 1,
            duration: 260,
            useNativeDriver: true,
          }),
        ]),
      ),
    );
    stagger.start();
    return () => stagger.stop();
  }, [sheet, pillAnims]);

  useEffect(() => {
    const loops = sparkAnims.map((v, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(SPARKS[i].delay),
          Animated.timing(v, {
            toValue: 1,
            duration: SPARKS[i].duration,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(v, {
            toValue: 0,
            duration: 10,
            useNativeDriver: true,
          }),
        ]),
      ),
    );
    loops.forEach(l => l.start());
    return () => loops.forEach(l => l.stop());
  }, [sparkAnims]);

  return (
    <ScreenBackground variant="menu">
      <View style={styles.root}>
        <View style={styles.topRow}>
          <View style={styles.topSpacer} />
          <IconButton Icon={Settings} onPress={onTutorial} size={44} round />
        </View>

        <View style={styles.art}>
          {SPARKS.map((s, i) => (
            <Animated.View
              key={i}
              pointerEvents="none"
              style={[
                styles.spark,
                {
                  left: s.left,
                  top: s.top,
                  opacity: sparkAnims[i].interpolate({
                    inputRange: [0, 0.4, 1],
                    outputRange: [0, 0.8, 0],
                  }),
                  transform: [
                    {
                      translateY: sparkAnims[i].interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, -18],
                      }),
                    },
                  ],
                },
              ]}
            />
          ))}
          <Image
            source={ART.spriteRuneHex}
            style={styles.decorSprite}
            resizeMode="contain"
          />
        </View>

        <Animated.View
          pointerEvents="box-none"
          style={[
            styles.sheet,
            {
              transform: [
                {
                  translateY: sheet.interpolate({
                    inputRange: [0, 1],
                    outputRange: [120, 0],
                  }),
                },
              ],
            },
          ]}>
          <View style={styles.grabber} />

          <Text style={styles.title}>OLYMPUS GATES</Text>
          <Text style={styles.tagline}>ROUTE THE AETHER . LIGHT EVERY BEACON</Text>

          <View style={styles.statsWrap}>
            <StatRow pills={pills} stagger={pillAnims} />
          </View>

          {/* rule #19: the hint sits ABOVE the CTA, never under it */}
          <Text style={styles.hint}>HOW TO PLAY . ROTATE . CHARGE</Text>

          <PrimaryButton label="PLAY NOW" Icon={Play} onPress={onPlay} height={60} />

          <View style={styles.secondaryRow}>
            <SecondaryButton label="ISLAND MAP" Icon={MapIcon} onPress={onMap} />
            <SecondaryButton
              label="TUTORIAL"
              Icon={GraduationCap}
              onPress={onTutorial}
            />
          </View>
        </Animated.View>
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1},
  topRow: {
    height: 72 + HEADER_PAD_TOP,
    paddingTop: HEADER_PAD_TOP,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  topSpacer: {flex: 1},
  art: {flex: 1},
  spark: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: C.accentSecondary,
  },
  decorSprite: {
    position: 'absolute',
    right: 22,
    bottom: 26,
    width: 96,
    height: 96,
  },
  sheet: {
    backgroundColor: 'rgba(20,26,60,0.94)',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: C.lineAccent,
    paddingHorizontal: 22,
    paddingTop: 16,
    paddingBottom: 26,
    shadowColor: C.accentPrimary,
    shadowOpacity: 0.28,
    shadowRadius: 26,
    shadowOffset: {width: 0, height: -10},
    elevation: 18,
  },
  grabber: {
    width: 44,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    backgroundColor: 'rgba(245,239,229,0.22)',
    marginBottom: 14,
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '900',
    letterSpacing: 3,
    color: C.textPrimary,
    textAlign: 'center',
  },
  tagline: {
    marginTop: 6,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '600',
    letterSpacing: 1.6,
    color: C.textSecondary,
    textAlign: 'center',
  },
  statsWrap: {marginTop: 18},
  hint: {
    marginTop: 18,
    marginBottom: 10,
    fontSize: 10.5,
    lineHeight: 14,
    fontWeight: '600',
    letterSpacing: 2,
    color: 'rgba(245,239,229,0.45)',
    textAlign: 'center',
  },
  secondaryRow: {marginTop: 12, flexDirection: 'row', gap: 10},
});
