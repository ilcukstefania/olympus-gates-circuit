import type {ConduitColour} from '../constants/theme';
import {cellKey, neighbourOf, oppositePort} from './hexGrid';
import type {Cell, SolveResult} from './types';

/** Live ports of a cell = base ports turned by its current rotation. */
export const livePorts = (cell: Cell): number[] =>
  cell.basePorts.map(p => (p + cell.rotation) % 6);

export const rotateCell = (cell: Cell): Cell => ({
  ...cell,
  rotation: (cell.rotation + 1) % 6,
});

export const cloneCells = (cells: Cell[]): Cell[] => cells.map(c => ({...c}));

/**
 * Flood fill from every source across cells whose facing ports touch.
 * A component is conflicted when it mixes two conduit colours - that is the
 * "overload" the player has to avoid. O(30) on this grid, so it is safe to run
 * synchronously after every tap.
 */
export function solve(cells: Cell[]): SolveResult {
  const byKey = new Map<number, Cell>();
  for (const cell of cells) {
    if (cell.kind !== 'empty') {
      byKey.set(cellKey(cell.row, cell.col), cell);
    }
  }

  const seen = new Set<number>();
  const energised = new Set<number>();
  const conflicted = new Set<number>();
  const litBeacons = new Set<number>();
  const flow = new Map<number, ConduitColour | 'conflict'>();

  let beaconCount = 0;
  for (const cell of byKey.values()) {
    if (cell.kind === 'beacon') {
      beaconCount += 1;
    }
  }

  for (const start of byKey.values()) {
    const startKey = cellKey(start.row, start.col);
    if (seen.has(startKey)) {
      continue;
    }

    const members: Cell[] = [];
    const stack: Cell[] = [start];
    seen.add(startKey);

    while (stack.length > 0) {
      const cur = stack.pop() as Cell;
      members.push(cur);
      for (const port of livePorts(cur)) {
        const nb = neighbourOf(cur.row, cur.col, port);
        if (!nb) {
          continue;
        }
        const nbKey = cellKey(nb.row, nb.col);
        const other = byKey.get(nbKey);
        if (!other || seen.has(nbKey)) {
          continue;
        }
        if (!livePorts(other).includes(oppositePort(port))) {
          continue;
        }
        seen.add(nbKey);
        stack.push(other);
      }
    }

    const sources = members.filter(m => m.kind === 'source');
    if (sources.length === 0) {
      continue; // dead stone, no energy
    }

    const colours = new Set(members.map(m => m.colour));
    const bad = colours.size > 1;

    for (const m of members) {
      const k = cellKey(m.row, m.col);
      energised.add(k);
      flow.set(k, bad ? 'conflict' : sources[0].colour);
      if (bad) {
        conflicted.add(k);
      } else if (m.kind === 'beacon') {
        litBeacons.add(k);
      }
    }
  }

  return {
    energised,
    conflicted,
    flow,
    litBeacons,
    beaconsLit: litBeacons.size,
    beaconCount,
    allLit:
      beaconCount > 0 && litBeacons.size === beaconCount && conflicted.size === 0,
  };
}
