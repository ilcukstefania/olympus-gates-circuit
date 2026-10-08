import type {ConduitColour} from '../constants/theme';

export type CellKind = 'empty' | 'rune' | 'source' | 'beacon';

export interface Cell {
  row: number;
  col: number;
  kind: CellKind;
  colour: ConduitColour;
  /** Ports in the SOLVED orientation. Live ports = (p + rotation) % 6. */
  basePorts: number[];
  /** Rotation steps of 60 degrees. */
  rotation: number;
}

export interface Level {
  id: number;
  name: string;
  moveLimit: number;
  cells: Cell[];
}

export interface SolveResult {
  /** keys of cells carrying energy from a source */
  energised: Set<number>;
  /** keys of cells in a colour-conflicted component */
  conflicted: Set<number>;
  /** key -> rendered colour of the live conduit ('conflict' for an overload) */
  flow: Map<number, ConduitColour | 'conflict'>;
  /** keys of beacons correctly fed */
  litBeacons: Set<number>;
  beaconsLit: number;
  beaconCount: number;
  allLit: boolean;
}

export type Outcome = 'win' | 'lose';

export interface IslandProgress {
  unlocked: boolean;
  stars: 0 | 1 | 2 | 3;
  bestMoves: number; // 0 = never cleared
}
