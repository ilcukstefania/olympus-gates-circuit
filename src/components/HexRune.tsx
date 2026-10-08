import React, {useCallback, useEffect, useRef} from 'react';
import {Animated, Pressable, StyleSheet, View} from 'react-native';
import Svg, {Circle, Line, Polygon} from 'react-native-svg';
import {HEX_H, HEX_W, ROTATE_SPRING, cellOffset} from '../constants/config';
import {C, THEME} from '../constants/theme';
import {hexPoints, portPoint} from '../game/hexGrid';
import type {Cell} from '../game/types';
import {BeaconNode} from './BeaconNode';
import {SourceNode} from './SourceNode';

interface Props {
  cell: Cell;
  live: boolean;
  conflicted: boolean;
  lit: boolean;
  glow: Animated.Value;
  onPress: (row: number, col: number) => void;
}

const CX = HEX_W / 2;
const CY = HEX_H / 2;
const HEX = hexPoints(HEX_W, HEX_H, 1);
const GLYPH = Math.min(HEX_W, HEX_H) * 0.72;

/** Shortest signed turn in degrees between two 60-degree rotation states. */
function deltaDeg(from: number, to: number): number {
  const d = (((to - from) % 6) + 6) % 6;
  return d <= 3 ? d * 60 : -(6 - d) * 60;
}

function HexRuneBase({cell, live, conflicted, lit, glow, onPress}: Props) {
  const {left, top} = cellOffset(cell.row, cell.col);
  const rotatable = cell.kind === 'rune';

  const deg = useRef(new Animated.Value(cell.rotation * 60)).current;
  const degValue = useRef(cell.rotation * 60);
  const lastRotation = useRef(cell.rotation);
  const bounce = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (cell.rotation === lastRotation.current) {
      return;
    }
    degValue.current += deltaDeg(lastRotation.current, cell.rotation);
    lastRotation.current = cell.rotation;
    Animated.spring(deg, {
      toValue: degValue.current,
      ...ROTATE_SPRING,
      useNativeDriver: true, // transform only
    }).start();
  }, [cell.rotation, deg]);

  const handlePress = useCallback(() => {
    if (rotatable) {
      onPress(cell.row, cell.col);
      return;
    }
    // locked endpoint: short refusal bounce, costs no move
    Animated.sequence([
      Animated.timing(bounce, {toValue: 1.06, duration: 80, useNativeDriver: true}),
      Animated.timing(bounce, {toValue: 1, duration: 80, useNativeDriver: true}),
    ]).start();
  }, [rotatable, onPress, cell.row, cell.col, bounce]);

  const base = conflicted ? C.danger : THEME.conduit[cell.colour];
  const conduitOpacity = live ? 1 : 0.32;

  const rotate = deg.interpolate({
    inputRange: [-3600, 3600],
    outputRange: ['-3600deg', '3600deg'],
  });

  return (
    <Pressable
      onPress={handlePress}
      // No hitSlop here on purpose: the hex bounding boxes already overlap their
      // neighbours, so extra slop would steal taps from the tile next door.
      style={[styles.tile, {left, top, width: HEX_W, height: HEX_H}]}>
      {live ? (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.glow,
            {
              backgroundColor: base,
              opacity: glow.interpolate({
                inputRange: [0, 1],
                outputRange: [0.1, 0.32],
              }),
            },
          ]}
        />
      ) : null}

      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.layer,
          {width: HEX_W, height: HEX_H, transform: [{rotate}, {scale: bounce}]},
        ]}>
        <Svg width={HEX_W} height={HEX_H}>
          <Polygon
            points={HEX}
            fill="rgba(28,36,80,0.92)"
            stroke={
              conflicted ? C.danger : live ? base : 'rgba(245,239,229,0.12)'
            }
            strokeWidth={conflicted || live ? 1.6 : 1}
          />
          {cell.basePorts.map(p => {
            const pt = portPoint(p, HEX_W, HEX_H, 4);
            return (
              <Line
                key={p}
                x1={CX}
                y1={CY}
                x2={pt.x}
                y2={pt.y}
                stroke={base}
                strokeOpacity={conduitOpacity}
                strokeWidth={5}
                strokeLinecap="round"
              />
            );
          })}
          {rotatable ? (
            <Circle
              cx={CX}
              cy={CY}
              r={live ? 5.5 : 4}
              fill={base}
              fillOpacity={live ? 1 : 0.45}
            />
          ) : null}
        </Svg>
      </Animated.View>

      {rotatable ? null : (
        <View pointerEvents="none" style={styles.layer}>
          <Svg width={HEX_W} height={HEX_H}>
            {cell.kind === 'source' ? (
              <SourceNode
                cx={CX}
                cy={CY}
                size={GLYPH}
                colour={base}
                live={live}
              />
            ) : (
              <BeaconNode
                cx={CX}
                cy={CY}
                size={GLYPH}
                colour={base}
                lit={lit}
                conflicted={conflicted}
              />
            )}
          </Svg>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {position: 'absolute', alignItems: 'center', justifyContent: 'center'},
  layer: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: HEX_W,
    height: HEX_H,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
    left: HEX_W * 0.1,
    top: HEX_H * 0.12,
    width: HEX_W * 0.8,
    height: HEX_H * 0.76,
    borderRadius: HEX_W * 0.4,
  },
});

export const HexRune = React.memo(HexRuneBase);
