import { COLS, ROWS, movesForIsland } from '../constants/config';
import { DIR_COUNT, cellIndex, neighborOf, opposite } from './hexGeometry';
import { CHANNELS } from './types';
import type { Cell, CellKind, Channel } from './types';

const BASE_GROUPS: Record<CellKind, number[][]> = {
  LINE: [[0, 3]],
  BEND: [[0, 2]],
  FORK: [[0, 2, 4]],
  BRIDGE: [
    [0, 3],
    [1, 4],
  ],
  BLOCK: [],
  SOURCE: [[0]],
  BEACON: [[0]],
};

export function baseGroupsFor(kind: CellKind): number[][] {
  return BASE_GROUPS[kind].map(g => g.slice());
}

/** Deterministic PRNG so an island number always yields the same board. */
function makeRng(seed: number) {
  let a = (seed * 1664525 + 1013904223) >>> 0;
  return function next(): number {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffled<T>(items: T[], rnd: () => number): T[] {
  const out = items.slice();
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rnd() * (i + 1));
    const tmp = out[i];
    out[i] = out[j];
    out[j] = tmp;
  }
  return out;
}

interface CarvedPath {
  cells: number[];
  dirs: number[];
}

/**
 * Randomised DFS that walks a simple path across free cells. Sharp 60-degree
 * turns are rejected so every intermediate cell is a LINE or a BEND — that is
 * the whole rune set the board is allowed to use.
 */
function carvePath(
  used: Set<number>,
  startRow: number,
  startCol: number,
  targetLen: number,
  rnd: () => number,
): CarvedPath | null {
  const cells: number[] = [cellIndex(startRow, startCol)];
  const dirs: number[] = [];
  const onPath = new Set<number>(cells);
  const coords: Array<{ row: number; col: number }> = [
    { row: startRow, col: startCol },
  ];

  function step(): boolean {
    if (cells.length >= targetLen) {
      return true;
    }
    const cur = coords[coords.length - 1];
    const order = shuffled([0, 1, 2, 3, 4, 5], rnd);
    for (const dir of order) {
      if (dirs.length > 0) {
        const inEdge = opposite(dirs[dirs.length - 1]);
        const diff = (dir - inEdge + DIR_COUNT) % DIR_COUNT;
        if (diff < 2 || diff > 4) {
          continue;
        }
      }
      const nb = neighborOf(cur.row, cur.col, dir);
      if (!nb) {
        continue;
      }
      const id = cellIndex(nb.row, nb.col);
      if (used.has(id) || onPath.has(id)) {
        continue;
      }
      cells.push(id);
      dirs.push(dir);
      onPath.add(id);
      coords.push(nb);
      if (step()) {
        return true;
      }
      cells.pop();
      dirs.pop();
      onPath.delete(id);
      coords.pop();
    }
    return false;
  }

  return step() ? { cells, dirs } : null;
}

function carveForChannel(
  used: Set<number>,
  desiredLen: number,
  rnd: () => number,
): CarvedPath | null {
  for (let len = desiredLen; len >= 3; len -= 1) {
    for (let attempt = 0; attempt < 80; attempt += 1) {
      const row = Math.floor(rnd() * ROWS);
      const col = Math.floor(rnd() * COLS);
      if (used.has(cellIndex(row, col))) {
        continue;
      }
      const path = carvePath(used, row, col, len, rnd);
      if (path) {
        return path;
      }
    }
  }
  return null;
}

function makeCell(
  id: number,
  kind: CellKind,
  turns: number,
  channel?: Channel,
): Cell {
  const row = Math.floor(id / COLS);
  const col = id % COLS;
  const fixed = kind === 'SOURCE' || kind === 'BEACON' || kind === 'BLOCK';
  return {
    id,
    row,
    col,
    kind,
    turns,
    solvedTurns: turns,
    baseGroups: baseGroupsFor(kind),
    channel,
    fixed,
  };
}

/**
 * Builds a solvable island. The board is carved SOLVED first (three disjoint
 * source -> beacon chains), then a bounded number of runes are spun out of
 * alignment so the total cost of undoing the scramble always fits inside the
 * move budget.
 */
export function buildIsland(island: number): Cell[] {
  const rnd = makeRng(island * 7919 + 17);
  const total = ROWS * COLS;
  const cells: Array<Cell | null> = new Array(total).fill(null);
  const used = new Set<number>();
  const rotatable: number[] = [];

  const desiredLen = 5 + Math.min(3, Math.floor(island / 2));

  for (let ci = 0; ci < CHANNELS.length; ci += 1) {
    const channel = CHANNELS[ci];
    const path = carveForChannel(used, desiredLen, rnd);
    if (!path) {
      continue;
    }

    for (const id of path.cells) {
      used.add(id);
    }

    const first = path.cells[0];
    cells[first] = makeCell(first, 'SOURCE', path.dirs[0], channel);

    const lastIdx = path.cells.length - 1;
    const last = path.cells[lastIdx];
    cells[last] = makeCell(
      last,
      'BEACON',
      opposite(path.dirs[path.dirs.length - 1]),
      channel,
    );

    for (let i = 1; i < lastIdx; i += 1) {
      const id = path.cells[i];
      const inEdge = opposite(path.dirs[i - 1]);
      const outEdge = path.dirs[i];
      const diff = (outEdge - inEdge + DIR_COUNT) % DIR_COUNT;
      if (diff === 3) {
        cells[id] = makeCell(id, 'LINE', inEdge);
      } else if (diff === 2) {
        cells[id] = makeCell(id, 'BEND', inEdge);
      } else {
        cells[id] = makeCell(id, 'BEND', outEdge);
      }
      rotatable.push(id);
    }
  }

  // Blocks and decorative runes fill whatever is left of the slab.
  const freeIds: number[] = [];
  for (let id = 0; id < total; id += 1) {
    if (!cells[id]) {
      freeIds.push(id);
    }
  }
  const scatter = shuffled(freeIds, rnd);
  const blockCount = Math.min(3, Math.floor(island / 3), scatter.length);
  const decorKinds: CellKind[] = ['LINE', 'BEND', 'FORK', 'BRIDGE'];

  scatter.forEach((id, i) => {
    if (i < blockCount) {
      cells[id] = makeCell(id, 'BLOCK', 0);
      return;
    }
    const kind = decorKinds[Math.floor(rnd() * decorKinds.length)];
    cells[id] = makeCell(id, kind, Math.floor(rnd() * DIR_COUNT));
  });

  // Scramble: every spun rune costs `c` taps to realign, and the sum of those
  // costs is capped well under the move budget, so the island stays solvable.
  const budget = movesForIsland(island);
  const costCap = Math.max(3, budget - 5);
  const picks = shuffled(rotatable, rnd).slice(
    0,
    Math.min(7 + island, 16, rotatable.length, costCap),
  );
  const costs = new Map<number, number>();
  let spent = 0;
  for (const id of picks) {
    costs.set(id, 1);
    spent += 1;
  }
  let guard = 0;
  while (spent < costCap && picks.length > 0 && guard < 200) {
    guard += 1;
    const id = picks[Math.floor(rnd() * picks.length)];
    const c = costs.get(id) || 1;
    if (c >= 3) {
      continue;
    }
    costs.set(id, c + 1);
    spent += 1;
  }
  costs.forEach((cost, id) => {
    const cell = cells[id];
    if (cell) {
      cell.turns += DIR_COUNT - cost;
    }
  });

  return cells.map((c, id) => c || makeCell(id, 'BLOCK', 0));
}

/** Taps still needed to bring every scrambled rune back into alignment. */
export function solutionCost(grid: Cell[]): number {
  let cost = 0;
  for (const cell of grid) {
    if (cell.fixed) {
      continue;
    }
    cost +=
      ((cell.solvedTurns - cell.turns) % DIR_COUNT + DIR_COUNT) % DIR_COUNT;
  }
  return cost;
}
