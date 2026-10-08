import React, {useEffect, useMemo, useRef} from 'react';
import {Animated, Easing, StyleSheet, View} from 'react-native';
import Svg, {Polygon} from 'react-native-svg';
import {
  BOARD_BORDER,
  BOARD_H,
  BOARD_W,
  GRID_COLS,
  GRID_ROWS,
  HEX_H,
  HEX_W,
  SHAKE_MS,
  cellOffset,
} from '../constants/config';
import {C} from '../constants/theme';
import {cellKey, hexPoints} from '../game/hexGrid';
import type {Cell} from '../game/types';
import {HexRune} from './HexRune';

interface Props {
  cells: Cell[];
  energised: Set<number>;
  conflicted: Set<number>;
  litBeacons: Set<number>;
  shakeToken: number;
  dimmed: boolean;
  onRotate: (row: number, col: number) => void;
}

const EMPTY_HEX = hexPoints(HEX_W, HEX_H, 2);

function CircuitBoardBase({
  cells,
  energised,
  conflicted,
  litBeacons,
  shakeToken,
  dimmed,
  onRotate,
}: Props) {
  const shake = useRef(new Animated.Value(0)).current;
  const enter = useRef(new Animated.Value(0)).current;
  const glow = useRef(new Animated.Value(0)).current;
  const firstShake = useRef(true);

  useEffect(() => {
    Animated.spring(enter, {
      toValue: 1,
      tension: 46,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, [enter]);

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(glow, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(glow, {
          toValue: 0,
          duration: 900,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [glow]);

  useEffect(() => {
    if (firstShake.current) {
      firstShake.current = false;
      return;
    }
    shake.setValue(0);
    Animated.sequence([
      Animated.timing(shake, {
        toValue: 1,
        duration: SHAKE_MS,
        easing: Easing.linear,
        useNativeDriver: true, // translateX only
      }),
    ]).start();
  }, [shakeToken, shake]);

  /** Cells that carry no circuit get a decorative, non-interactive stone. */
  const emptySlots = useMemo(() => {
    const taken = new Set(cells.map(c => cellKey(c.row, c.col)));
    const out: Array<{row: number; col: number}> = [];
    for (let r = 0; r < GRID_ROWS; r++) {
      for (let c = 0; c < GRID_COLS; c++) {
        if (!taken.has(cellKey(r, c))) {
          out.push({row: r, col: c});
        }
      }
    }
    return out;
  }, [cells]);

  const translateX = shake.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: [0, 8, -8, 6, 0],
  });

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[
        styles.frame,
        {
          opacity: Animated.multiply(enter, dimmed ? 0.45 : 1),
          transform: [
            {translateX},
            {
              scale: enter.interpolate({
                inputRange: [0, 1],
                outputRange: [0.94, 1],
              }),
            },
          ],
        },
      ]}>
      {emptySlots.map(slot => {
        const {left, top} = cellOffset(slot.row, slot.col);
        return (
          <View
            key={'e' + slot.row + '-' + slot.col}
            pointerEvents="none"
            style={[styles.stone, {left, top}]}>
            <Svg width={HEX_W} height={HEX_H}>
              <Polygon
                points={EMPTY_HEX}
                fill="rgba(20,26,60,0.42)"
                stroke="rgba(245,239,229,0.06)"
                strokeWidth={1}
              />
            </Svg>
          </View>
        );
      })}

      {cells.map(cell => {
        const k = cellKey(cell.row, cell.col);
        return (
          <HexRune
            key={k}
            cell={cell}
            live={energised.has(k)}
            conflicted={conflicted.has(k)}
            lit={litBeacons.has(k)}
            glow={glow}
            onPress={onRotate}
          />
        );
      })}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  frame: {
    width: BOARD_W,
    height: BOARD_H,
    borderWidth: BOARD_BORDER,
    borderColor: 'rgba(57,199,255,0.26)',
    borderRadius: 24,
    backgroundColor: 'rgba(10,14,38,0.80)',
    shadowColor: C.accentPrimary,
    shadowOpacity: 0.22,
    shadowRadius: 22,
    shadowOffset: {width: 0, height: 10},
    elevation: 14,
  },
  stone: {position: 'absolute', width: HEX_W, height: HEX_H},
});

export const CircuitBoard = React.memo(CircuitBoardBase);
