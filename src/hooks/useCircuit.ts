import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  CHARGE_LOCK_MS,
  MAX_OVERLOADS,
  SHAKE_MS,
  UNDOS_PER_ISLAND,
  WIN_DELAY_MS,
} from '../constants/config';
import {cloneCells, solve} from '../game/circuit';
import type {Cell, Level, Outcome} from '../game/types';

export type Phase = 'playing' | 'charging' | 'overload' | 'over';

export interface CircuitApi {
  cells: Cell[];
  phase: Phase;
  movesUsed: number;
  movesLeft: number;
  overloads: number;
  undosLeft: number;
  solved: boolean;
  beaconsLit: number;
  beaconCount: number;
  energised: Set<number>;
  conflicted: Set<number>;
  flow: Map<number, 'cyan' | 'gold' | 'violet' | 'conflict'>;
  litBeacons: Set<number>;
  shakeToken: number;
  rotate: (row: number, col: number) => void;
  undo: () => void;
  reset: () => void;
  charge: () => void;
}

const snapshot = (cells: Cell[]): number[] => cells.map(c => c.rotation);

export function useCircuit(
  level: Level,
  onGameOver: (outcome: Outcome, movesUsed: number) => void,
): CircuitApi {
  const [cells, setCells] = useState<Cell[]>(() => cloneCells(level.cells));
  const [movesUsed, setMovesUsed] = useState(0);
  const [overloads, setOverloads] = useState(0);
  const [undosLeft, setUndosLeft] = useState(UNDOS_PER_ISLAND);
  const [phase, setPhase] = useState<Phase>('playing');
  const [shakeToken, setShakeToken] = useState(0);

  const history = useRef<number[][]>([]);
  const startRotations = useRef<number[]>(snapshot(level.cells));
  const finished = useRef(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const overRef = useRef(onGameOver);
  overRef.current = onGameOver;

  // re-seed when the island changes
  useEffect(() => {
    setCells(cloneCells(level.cells));
    setMovesUsed(0);
    setOverloads(0);
    setUndosLeft(UNDOS_PER_ISLAND);
    setPhase('playing');
    history.current = [];
    startRotations.current = snapshot(level.cells);
    finished.current = false;
  }, [level]);

  useEffect(
    () => () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    },
    [],
  );

  const later = useCallback((fn: () => void, ms: number) => {
    const id = setTimeout(fn, ms);
    timers.current.push(id);
  }, []);

  const result = useMemo(() => solve(cells), [cells]);

  const finish = useCallback(
    (outcome: Outcome, moves: number, delay: number) => {
      if (finished.current) {
        return;
      }
      finished.current = true;
      setPhase('over');
      later(() => overRef.current(outcome, moves), delay);
    },
    [later],
  );

  const rotate = useCallback(
    (row: number, col: number) => {
      if (finished.current || phase !== 'playing') {
        return;
      }
      const target = cells.find(
        c => c.row === row && c.col === col && c.kind === 'rune',
      );
      if (!target) {
        return; // locked cell: costs nothing
      }

      history.current.push(snapshot(cells));
      if (history.current.length > 32) {
        history.current.shift();
      }

      const next = cells.map(c =>
        c.row === row && c.col === col
          ? {...c, rotation: (c.rotation + 1) % 6}
          : c,
      );
      const used = movesUsed + 1;
      setCells(next);
      setMovesUsed(used);

      if (used >= level.moveLimit && !solve(next).allLit) {
        finish('lose', used, SHAKE_MS + 260);
        setShakeToken(t => t + 1);
      }
    },
    [cells, movesUsed, phase, level.moveLimit, finish],
  );

  const undo = useCallback(() => {
    if (finished.current || phase !== 'playing') {
      return;
    }
    if (undosLeft <= 0 || history.current.length === 0) {
      return;
    }
    const prev = history.current.pop() as number[];
    setCells(cur => cur.map((c, i) => ({...c, rotation: prev[i] ?? c.rotation})));
    setMovesUsed(m => Math.max(0, m - 1));
    setUndosLeft(u => u - 1);
  }, [phase, undosLeft]);

  const reset = useCallback(() => {
    if (finished.current || phase !== 'playing') {
      return;
    }
    if (undosLeft <= 0) {
      return;
    }
    const base = startRotations.current;
    history.current = [];
    setCells(cur => cur.map((c, i) => ({...c, rotation: base[i] ?? c.rotation})));
    setMovesUsed(0);
    setUndosLeft(u => u - 1);
  }, [phase, undosLeft]);

  const charge = useCallback(() => {
    if (finished.current || phase !== 'playing') {
      return;
    }
    setPhase('charging');

    if (result.allLit) {
      later(() => finish('win', movesUsed, WIN_DELAY_MS), CHARGE_LOCK_MS);
      return;
    }

    const nextOverloads = overloads + 1;
    later(() => {
      setOverloads(nextOverloads);
      setShakeToken(t => t + 1);
      setPhase('overload');
      if (nextOverloads >= MAX_OVERLOADS) {
        finish('lose', movesUsed, SHAKE_MS + 320);
      } else {
        later(() => {
          if (!finished.current) {
            setPhase('playing');
          }
        }, 520);
      }
    }, CHARGE_LOCK_MS);
  }, [phase, result.allLit, overloads, movesUsed, later, finish]);

  return {
    cells,
    phase,
    movesUsed,
    movesLeft: Math.max(0, level.moveLimit - movesUsed),
    overloads,
    undosLeft,
    solved: result.allLit,
    beaconsLit: result.beaconsLit,
    beaconCount: result.beaconCount,
    energised: result.energised,
    conflicted: result.conflicted,
    flow: result.flow,
    litBeacons: result.litBeacons,
    shakeToken,
    rotate,
    undo,
    reset,
    charge,
  };
}
