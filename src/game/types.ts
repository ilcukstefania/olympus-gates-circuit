export type Channel = 'cyan' | 'gold' | 'violet';

export const CHANNELS: Channel[] = ['cyan', 'gold', 'violet'];

export type CellKind =
  | 'LINE'
  | 'BEND'
  | 'FORK'
  | 'BRIDGE'
  | 'BLOCK'
  | 'SOURCE'
  | 'BEACON';

export interface Cell {
  id: number;
  row: number;
  col: number;
  kind: CellKind;
  /** Monotonic turn counter. Visual rotation = turns * 60deg. */
  turns: number;
  /** Turn counter of the carved (solved) layout, before scrambling. */
  solvedTurns: number;
  /** Edge groups at turns === 0. Each group is an independent conduit. */
  baseGroups: number[][];
  /** Only set for SOURCE / BEACON. */
  channel?: Channel;
  /** Fixed cells (sources, beacons, blocks) never rotate. */
  fixed: boolean;
}

export interface TraceResult {
  lit: Record<Channel, boolean>;
  /** key = `${cellId}:${groupIndex}` -> channel currently flowing through it */
  energized: Record<string, Channel>;
  /** cell ids of beacons being fed the wrong channel */
  conflicts: number[];
}

export interface RoundResult {
  win: boolean;
  stars: 0 | 1 | 2 | 3;
  movesLeft: number;
  movesTotal: number;
  beacons: number;
  reason: 'SOLVED' | 'NO_MOVES' | 'OVERLOAD';
}
