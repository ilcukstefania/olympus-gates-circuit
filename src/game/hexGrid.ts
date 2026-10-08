import {GRID_COLS, GRID_ROWS} from '../constants/config';

/**
 * Pointy-top hexagons on an "odd-r" offset grid: odd rows are shifted right
 * by half a hex. Ports are numbered clockwise from the upper-right edge:
 *   0 = NE, 1 = E, 2 = SE, 3 = SW, 4 = W, 5 = NW
 */
export const PORTS = [0, 1, 2, 3, 4, 5] as const;

export const oppositePort = (p: number): number => (p + 3) % 6;

export const cellKey = (row: number, col: number): number => row * GRID_COLS + col;

export const inBounds = (row: number, col: number): boolean =>
  row >= 0 && row < GRID_ROWS && col >= 0 && col < GRID_COLS;

export function neighbourOf(
  row: number,
  col: number,
  port: number,
): {row: number; col: number} | null {
  const odd = row % 2 === 1;
  let dr = 0;
  let dc = 0;
  switch (port) {
    case 0:
      dr = -1;
      dc = odd ? 1 : 0;
      break;
    case 1:
      dr = 0;
      dc = 1;
      break;
    case 2:
      dr = 1;
      dc = odd ? 1 : 0;
      break;
    case 3:
      dr = 1;
      dc = odd ? 0 : -1;
      break;
    case 4:
      dr = 0;
      dc = -1;
      break;
    default:
      dr = -1;
      dc = odd ? 0 : -1;
      break;
  }
  const r = row + dr;
  const c = col + dc;
  return inBounds(r, c) ? {row: r, col: c} : null;
}

/**
 * Angle (degrees, 0 = east, clockwise with y pointing down) of the midpoint of
 * the edge owned by `port`. For a pointy-top hex of width W every edge midpoint
 * sits exactly W/2 from the centre, which keeps conduits visually identical.
 */
export const portAngle = (port: number): number => (port * 60 + 300) % 360;

export function portPoint(port: number, hexW: number, hexH: number, inset = 1) {
  const a = (portAngle(port) * Math.PI) / 180;
  const r = hexW / 2 - inset;
  return {x: hexW / 2 + r * Math.cos(a), y: hexH / 2 + r * Math.sin(a)};
}

/** The six vertices of a pointy-top hexagon inscribed in w x h. */
export function hexPoints(w: number, h: number, inset = 1): string {
  const x0 = inset;
  const x1 = w - inset;
  const y0 = inset;
  const y1 = h - inset;
  const q = (y1 - y0) / 4;
  return [
    `${w / 2},${y0}`,
    `${x1},${y0 + q}`,
    `${x1},${y1 - q}`,
    `${w / 2},${y1}`,
    `${x0},${y1 - q}`,
    `${x0},${y0 + q}`,
  ].join(' ');
}
