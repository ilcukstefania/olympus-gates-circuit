import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import {
  BOARD_H,
  BOARD_W,
  BORDER,
  HALF_STEP,
  HEX_H,
  HEX_W,
  PAD,
  V_STEP,
} from '../constants/config';
import theme from '../constants/theme';
import type { Cell, Channel } from '../game/types';
import RuneHex from './RuneHex';

interface Props {
  grid: Cell[];
  energized: Record<string, Channel>;
  conflicts: number[];
  surgeId: number;
  dimmed: boolean;
  onRotate: (id: number) => void;
}

/**
 * Four stacked layers: board frame -> stone slab -> runes -> glowing veins.
 * Cell origins follow the BOARD_FRAME formula so nothing can escape the frame.
 */
export function HexBoard({
  grid,
  energized,
  conflicts,
  surgeId,
  dimmed,
  onRotate,
}: Props) {
  const conflictSet = useMemo(() => new Set(conflicts), [conflicts]);

  return (
    <View style={[styles.frame, dimmed ? styles.dim : null]}>
      <View style={styles.slab} />
      {grid.map(cell => {
        // Yoga measures an absolute child from the parent's INNER border edge,
        // so the origin carries PAD only — BORDER is already accounted for.
        // Outer inset therefore lands on PAD + BORDER === BOARD_FRAME.
        const left =
          PAD + cell.col * HEX_W + (cell.row % 2 === 1 ? HALF_STEP : 0);
        const top = PAD + cell.row * V_STEP;
        const sig = cell.baseGroups
          .map((_g, gi) => energized[`${cell.id}:${gi}`] || '')
          .join(',');
        return (
          <RuneHex
            key={cell.id}
            cell={cell}
            left={left}
            top={top}
            w={HEX_W}
            h={HEX_H}
            sig={sig}
            conflict={conflictSet.has(cell.id)}
            surging={surgeId === cell.id}
            onPress={onRotate}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    width: BOARD_W,
    height: BOARD_H,
    borderWidth: BORDER,
    borderColor: 'rgba(243,197,76,0.45)',
    borderRadius: 22,
    backgroundColor: 'rgba(9,13,36,0.62)',
    shadowColor: theme.colors.violet,
    shadowOpacity: 0.45,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 10 },
    elevation: 16,
  },
  dim: {
    opacity: 0.6,
  },
  slab: {
    position: 'absolute',
    left: PAD - 5,
    top: PAD - 5,
    right: PAD - 5,
    bottom: PAD - 5,
    borderRadius: 16,
    backgroundColor: 'rgba(28,36,80,0.55)',
  },
});

export default HexBoard;
