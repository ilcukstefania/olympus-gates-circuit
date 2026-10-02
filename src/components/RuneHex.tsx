import React, { memo, useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';
import Svg, { Circle, G, Polygon, Path } from 'react-native-svg';

import theme, { CHANNEL_COLORS } from '../constants/theme';
import { edgeMid, hexPoints } from '../game/hexGeometry';
import type { Cell, Channel } from '../game/types';
import BeaconGlyph from './BeaconGlyph';
import SourceGlyph from './SourceGlyph';

interface Props {
  cell: Cell;
  left: number;
  top: number;
  w: number;
  h: number;
  /** One token per edge-group: 'cyan' | 'gold' | 'violet' | '' */
  sig: string;
  conflict: boolean;
  surging: boolean;
  onPress: (id: number) => void;
}

const HIT = { top: 2, bottom: 2, left: 2, right: 2 };
const IDLE_WIRE = 'rgba(245,239,229,0.30)';

function groupPath(
  edges: number[],
  w: number,
  h: number,
): string {
  const cx = w / 2;
  const cy = h / 2;
  return edges
    .map(e => {
      const m = edgeMid(w, h, e);
      return `M ${cx} ${cy} L ${m.x} ${m.y}`;
    })
    .join(' ');
}

function RuneHexBase({
  cell,
  left,
  top,
  w,
  h,
  sig,
  conflict,
  surging,
  onPress,
}: Props) {
  const anim = useRef(new Animated.Value(cell.turns)).current;

  useEffect(() => {
    Animated.spring(anim, {
      toValue: cell.turns,
      tension: 90,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, [anim, cell.turns]);

  const rotate = anim.interpolate({
    inputRange: [0, 6],
    outputRange: ['0deg', '360deg'],
  });

  const tokens = sig.split(',');
  const isBlock = cell.kind === 'BLOCK';
  const isSource = cell.kind === 'SOURCE';
  const isBeacon = cell.kind === 'BEACON';
  const beaconLit = isBeacon && tokens[0] === cell.channel;

  const faceFill = isBlock ? theme.colors.surfaceAlt : theme.colors.surface;
  const faceStroke = surging
    ? theme.colors.secondary
    : conflict
    ? theme.colors.danger
    : 'rgba(245,239,229,0.16)';

  return (
    <Pressable
      style={[styles.cell, { left, top, width: w, height: h }]}
      onPress={() => onPress(cell.id)}
      disabled={cell.fixed}
      hitSlop={HIT}
      accessibilityRole="button"
      accessibilityLabel={`Rune ${cell.row + 1}-${cell.col + 1}`}>
      {beaconLit ? (
        <View
          pointerEvents="none"
          style={[
            styles.beam,
            {
              left: w / 2 - 3,
              backgroundColor:
                CHANNEL_COLORS[(cell.channel || 'cyan') as Channel],
            },
          ]}
        />
      ) : null}

      <Animated.View
        pointerEvents="box-none"
        style={[styles.layer, { width: w, height: h, transform: [{ rotate }] }]}>
        <Svg width={w} height={h}>
          <Polygon
            points={hexPoints(w, h)}
            fill={faceFill}
            stroke={faceStroke}
            strokeWidth={surging || conflict ? 2.5 : 1.5}
          />

          {isBlock ? (
            <Circle cx={w / 2} cy={h / 2} r={4} fill="rgba(245,239,229,0.14)" />
          ) : null}

          {cell.baseGroups.map((edges, gi) => {
            if (isSource || isBeacon) {
              return (
                <Path
                  key={gi}
                  d={groupPath(edges, w, h)}
                  stroke={
                    conflict
                      ? theme.colors.danger
                      : CHANNEL_COLORS[(cell.channel || 'cyan') as Channel]
                  }
                  strokeWidth={6}
                  strokeLinecap="round"
                  fill="none"
                />
              );
            }
            const token = tokens[gi] || '';
            const live = token.length > 0;
            const color = conflict
              ? theme.colors.danger
              : live
              ? CHANNEL_COLORS[token as Channel]
              : IDLE_WIRE;
            const d = groupPath(edges, w, h);
            return (
              <G key={gi}>
                {live ? (
                  <Path
                    d={d}
                    stroke={color}
                    strokeWidth={12}
                    strokeLinecap="round"
                    opacity={0.22}
                    fill="none"
                  />
                ) : null}
                <Path
                  d={d}
                  stroke={color}
                  strokeWidth={live ? 6 : 5}
                  strokeLinecap="round"
                  fill="none"
                />
              </G>
            );
          })}

          {isSource && cell.channel ? (
            <SourceGlyph channel={cell.channel} w={w} h={h} />
          ) : null}
          {isBeacon && cell.channel ? (
            <BeaconGlyph
              channel={cell.channel}
              lit={beaconLit}
              w={w}
              h={h}
            />
          ) : null}
        </Svg>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cell: {
    position: 'absolute',
  },
  layer: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
  beam: {
    position: 'absolute',
    top: -34,
    width: 6,
    height: 44,
    borderRadius: 3,
    opacity: 0.55,
  },
});

export const RuneHex = memo(RuneHexBase);

export default RuneHex;
