import React, {useCallback} from 'react';
import {Animated, Pressable, StyleSheet, Text, View} from 'react-native';
import Svg, {Polygon} from 'react-native-svg';
import {Lock} from 'lucide-react-native';
import {C, THEME} from '../constants/theme';
import {hexPoints} from '../game/hexGrid';
import type {IslandProgress, Level} from '../game/types';
import {beaconCountOf} from '../game/levels';
import {usePressScale} from '../hooks/usePressScale';
import {StarRow} from './StarRow';

interface Props {
  level: Level;
  index: number;
  progress: IslandProgress;
  onPress: (index: number) => void;
}

const BADGE = 56;
const BADGE_HEX = hexPoints(BADGE, BADGE, 2);
const ACCENTS = [THEME.conduit.cyan, THEME.conduit.gold, THEME.conduit.violet];

function IslandCardBase({level, index, progress, onPress}: Props) {
  const {scale, onPressIn, onPressOut} = usePressScale(0.98);
  const accent = ACCENTS[index % ACCENTS.length];
  const locked = !progress.unlocked;

  const handlePress = useCallback(() => {
    if (!locked) {
      onPress(index);
    }
  }, [locked, onPress, index]);

  return (
    <Pressable
      onPress={locked ? undefined : handlePress}
      onPressIn={locked ? undefined : onPressIn}
      onPressOut={locked ? undefined : onPressOut}
      hitSlop={{top: 6, bottom: 6, left: 8, right: 8}}
      style={styles.hit}>
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.card,
          {
            borderColor: accent + '33',
            opacity: locked ? 0.45 : 1,
            transform: [{scale}],
          },
        ]}>
        <View style={styles.badge}>
          <Svg width={BADGE} height={BADGE}>
            <Polygon
              points={BADGE_HEX}
              fill={accent + '1A'}
              stroke={accent}
              strokeWidth={1.6}
            />
          </Svg>
          <View pointerEvents="none" style={styles.badgeInner}>
            {locked ? (
              <Lock size={20} color={C.textMuted} strokeWidth={2.4} />
            ) : (
              <Text style={styles.badgeNum}>{index + 1}</Text>
            )}
          </View>
        </View>

        <View style={styles.body}>
          <Text style={styles.name} numberOfLines={1}>
            {level.name}
          </Text>
          <Text style={styles.meta} numberOfLines={1}>
            {'5x6 GRID . ' +
              beaconCountOf(level) +
              ' BEACONS . ' +
              level.moveLimit +
              ' MOVES'}
          </Text>
        </View>

        <StarRow earned={progress.stars} />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  hit: {width: '100%', height: 92},
  card: {
    width: '100%',
    height: 92,
    borderRadius: 20,
    backgroundColor: 'rgba(28,36,80,0.86)',
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 14,
    shadowColor: '#050510',
    shadowOpacity: 0.5,
    shadowRadius: 14,
    shadowOffset: {width: 0, height: 6},
    elevation: 8,
  },
  badge: {
    width: BADGE,
    height: BADGE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeInner: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: BADGE,
    height: BADGE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeNum: {
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '900',
    color: C.textPrimary,
  },
  body: {flex: 1},
  name: {
    fontSize: 15,
    lineHeight: 19,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: C.textPrimary,
  },
  meta: {
    marginTop: 4,
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '600',
    letterSpacing: 1.2,
    color: C.textSecondary,
  },
});

export const IslandCard = React.memo(IslandCardBase);
