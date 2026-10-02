import { cellIndex, groupsOf, neighborOf, opposite } from './hexGeometry';
import type { Cell, Channel, TraceResult } from './types';

interface Pulse {
  row: number;
  col: number;
  dir: number;
  channel: Channel;
}

/**
 * Breadth-first energy trace. Every SOURCE pushes its channel out of its own
 * edge; a conduit carries the pulse to every other edge of the group the
 * pulse entered through. BRIDGE has two independent groups, so two channels
 * can cross without mixing. BLOCK conducts nothing.
 */
export function trace(grid: Cell[]): TraceResult {
  const lit: Record<Channel, boolean> = {
    cyan: false,
    gold: false,
    violet: false,
  };
  const energized: Record<string, Channel> = {};
  const conflicts: number[] = [];

  const queue: Pulse[] = [];
  const visited = new Set<string>();

  for (const cell of grid) {
    if (cell.kind !== 'SOURCE' || !cell.channel) {
      continue;
    }
    const outEdges = groupsOf(cell)[0] || [];
    energized[`${cell.id}:0`] = cell.channel;
    for (const dir of outEdges) {
      queue.push({ row: cell.row, col: cell.col, dir, channel: cell.channel });
    }
  }

  let head = 0;
  while (head < queue.length) {
    const pulse = queue[head];
    head += 1;

    const nb = neighborOf(pulse.row, pulse.col, pulse.dir);
    if (!nb) {
      continue;
    }
    const cell = grid[cellIndex(nb.row, nb.col)];
    if (!cell || cell.kind === 'BLOCK' || cell.kind === 'SOURCE') {
      continue;
    }

    const inEdge = opposite(pulse.dir);

    if (cell.kind === 'BEACON') {
      const key = `${cell.id}:0`;
      if (cell.channel === pulse.channel) {
        lit[pulse.channel] = true;
        energized[key] = pulse.channel;
      } else {
        if (conflicts.indexOf(cell.id) === -1) {
          conflicts.push(cell.id);
        }
        energized[key] = pulse.channel;
      }
      continue;
    }

    const groups = groupsOf(cell);
    let groupIndex = -1;
    for (let gi = 0; gi < groups.length; gi += 1) {
      if (groups[gi].indexOf(inEdge) !== -1) {
        groupIndex = gi;
        break;
      }
    }
    if (groupIndex === -1) {
      continue;
    }

    const visitKey = `${cell.id}:${groupIndex}:${pulse.channel}`;
    if (visited.has(visitKey)) {
      continue;
    }
    visited.add(visitKey);
    energized[`${cell.id}:${groupIndex}`] = pulse.channel;

    for (const edge of groups[groupIndex]) {
      if (edge === inEdge) {
        continue;
      }
      queue.push({
        row: cell.row,
        col: cell.col,
        dir: edge,
        channel: pulse.channel,
      });
    }
  }

  return { lit, energized, conflicts };
}

export function litCount(lit: Record<Channel, boolean>): number {
  let n = 0;
  if (lit.cyan) {
    n += 1;
  }
  if (lit.gold) {
    n += 1;
  }
  if (lit.violet) {
    n += 1;
  }
  return n;
}
