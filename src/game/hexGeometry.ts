import { COLS, ROWS } from '../constants/config';
import type { Cell } from './types';

/**
 * Pointy-top hexes on an odd-r offset grid (odd rows shifted right by half a
 * cell). Edge indices run clockwise starting at East:
 *   0 = E, 1 = SE, 2 = SW, 3 = W, 4 = NW, 5 = NE
 */
export const DIR_COUNT = 6;

const EVEN_ROW_DELTAS: Array<[number, number]> = [
  [1, 0], // E
  [0, 1], // SE
  [-1, 1], // SW
  [-1, 0], // W
  [-1, -1], // NW
  [0, -1], // NE
];

const ODD_ROW_DELTAS: Array<[number, number]> = [
  [1, 0], // E
  [1, 1], // SE
  [0, 1], // SW
  [-1, 0], // W
  [0, -1], // NW
  [1, -1], // NE
];

export function opposite(dir: number): number {
  return (dir + 3) % DIR_COUNT;
}

export function cellIndex(row: number, col: number): number {
  return row * COLS + col;
}

export function inBounds(row: number, col: number): boolean {
  return row >= 0 && row < ROWS && col >= 0 && col < COLS;
}

export function neighborOf(
  row: number,
  col: number,
  dir: number,
): { row: number; col: number } | null {
  const deltas = row % 2 === 1 ? ODD_ROW_DELTAS : EVEN_ROW_DELTAS;
  const d = deltas[dir];
  const nc = col + d[0];
  const nr = row + d[1];
  if (!inBounds(nr, nc)) {
    return null;
  }
  return { row: nr, col: nc };
}

/** Absolute edge groups for a cell given its current turn counter. */
export function groupsOf(cell: Cell): number[][] {
  const r = ((cell.turns % DIR_COUNT) + DIR_COUNT) % DIR_COUNT;
  return cell.baseGroups.map(g => g.map(e => (e + r) % DIR_COUNT));
}

/** SVG polygon points for a pointy-top hex that fills w x h. */
export function hexPoints(w: number, h: number): string {
  const q = h / 4;
  return [
    `${w / 2},0`,
    `${w},${q}`,
    `${w},${3 * q}`,
    `${w / 2},${h}`,
    `0,${3 * q}`,
    `0,${q}`,
  ].join(' ');
}

/** Midpoint of the given edge, in local hex coordinates. */
export function edgeMid(
  w: number,
  h: number,
  dir: number,
): { x: number; y: number } {
  switch (dir) {
    case 0:
      return { x: w, y: h / 2 };
    case 1:
      return { x: (w * 3) / 4, y: (h * 7) / 8 };
    case 2:
      return { x: w / 4, y: (h * 7) / 8 };
    case 3:
      return { x: 0, y: h / 2 };
    case 4:
      return { x: w / 4, y: h / 8 };
    default:
      return { x: (w * 3) / 4, y: h / 8 };
  }
}
