import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  LOSE_DELAY_MS,
  MAX_OVERLOADS,
  ROTATE_MS,
  WIN_DELAY_MS,
  movesForIsland,
  undosForIsland,
} from '../constants/config';
import { litCount, trace } from '../game/circuit';
import { buildIsland } from '../game/levelGen';
import { starsFor } from '../game/scoring';
import type { Cell, RoundResult } from '../game/types';

export type RoundPhase = 'idle' | 'rotating' | 'overload' | 'win' | 'lose';

export function useRound(island: number, onFinish: (r: RoundResult) => void) {
  const movesTotal = movesForIsland(island);

  const [grid, setGrid] = useState<Cell[]>(() => buildIsland(island));
  const [moves, setMoves] = useState(movesTotal);
  const [overloads, setOverloads] = useState(0);
  const [undoLeft, setUndoLeft] = useState(() => undosForIsland(island));
  const [phase, setPhase] = useState<RoundPhase>('idle');
  const [chargeKey, setChargeKey] = useState(0);
  const [surgeId, setSurgeId] = useState(-1);

  const lockedRef = useRef(false);
  const endedRef = useRef(false);
  const undoStackRef = useRef<number[]>([]);
  const prevConflictsRef = useRef<Set<number>>(new Set());
  const timersRef = useRef<Array<ReturnType<typeof setTimeout>>>([]);

  const movesRef = useRef(moves);
  movesRef.current = moves;

  const gridRef = useRef(grid);
  gridRef.current = grid;

  const finishRef = useRef(onFinish);
  finishRef.current = onFinish;

  const result = useMemo(() => trace(grid), [grid]);
  const beacons = litCount(result.lit);

  const schedule = useCallback((fn: () => void, ms: number) => {
    const id = setTimeout(fn, ms);
    timersRef.current.push(id);
  }, []);

  useEffect(() => {
    const timers = timersRef;
    return () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, []);

  const endRound = useCallback(
    (win: boolean, reason: RoundResult['reason'], litNow: number) => {
      if (endedRef.current) {
        return;
      }
      endedRef.current = true;
      lockedRef.current = true;
      setPhase(win ? 'win' : 'lose');
      const movesLeft = Math.max(0, movesRef.current);
      schedule(
        () => {
          finishRef.current({
            win,
            stars: win ? starsFor(movesLeft, movesTotal) : 0,
            movesLeft,
            movesTotal,
            beacons: litNow,
            reason,
          });
        },
        win ? WIN_DELAY_MS : LOSE_DELAY_MS,
      );
    },
    [movesTotal, schedule],
  );

  /* New wrong-channel hits are the only thing that bumps the overload meter. */
  useEffect(() => {
    const prev = prevConflictsRef.current;
    let fresh = 0;
    for (const id of result.conflicts) {
      if (!prev.has(id)) {
        fresh += 1;
      }
    }
    prevConflictsRef.current = new Set(result.conflicts);
    if (fresh > 0) {
      setOverloads(o => o + fresh);
      setPhase(p => (p === 'win' || p === 'lose' ? p : 'overload'));
      schedule(() => {
        setPhase(p => (p === 'overload' ? 'idle' : p));
      }, 420);
    }
  }, [result, schedule]);

  /* Terminal conditions. */
  useEffect(() => {
    if (endedRef.current) {
      return;
    }
    if (beacons >= 3) {
      endRound(true, 'SOLVED', beacons);
      return;
    }
    if (overloads >= MAX_OVERLOADS) {
      endRound(false, 'OVERLOAD', beacons);
      return;
    }
    if (moves <= 0) {
      endRound(false, 'NO_MOVES', beacons);
    }
  }, [beacons, overloads, moves, endRound]);

  const rotate = useCallback(
    (id: number) => {
      if (lockedRef.current || endedRef.current) {
        return;
      }
      lockedRef.current = true;
      setPhase('rotating');
      undoStackRef.current.push(id);
      setGrid(prev =>
        prev.map(c => (c.id === id ? { ...c, turns: c.turns + 1 } : c)),
      );
      setMoves(m => m - 1);
      setSurgeId(-1);
      schedule(() => {
        lockedRef.current = false;
        setPhase(p => (p === 'rotating' ? 'idle' : p));
      }, ROTATE_MS);
    },
    [schedule],
  );

  const undo = useCallback(() => {
    if (lockedRef.current || endedRef.current) {
      return;
    }
    if (undoLeft <= 0 || undoStackRef.current.length === 0) {
      return;
    }
    const id = undoStackRef.current.pop();
    if (id === undefined) {
      return;
    }
    setGrid(prev =>
      prev.map(c => (c.id === id ? { ...c, turns: c.turns - 1 } : c)),
    );
    setMoves(m => m + 1);
    setUndoLeft(u => u - 1);
  }, [undoLeft]);

  const charge = useCallback(() => {
    if (endedRef.current) {
      return;
    }
    setChargeKey(k => k + 1);
    setSurgeId(-1);
  }, []);

  const surge = useCallback(() => {
    const candidates = gridRef.current.filter(c => !c.fixed);
    if (candidates.length > 0) {
      setSurgeId(candidates[Math.floor(candidates.length / 2)].id);
    }
    setChargeKey(k => k + 1);
  }, []);

  const forceEnd = useCallback(() => {
    endRound(false, 'OVERLOAD', litCount(result.lit));
  }, [endRound, result]);

  return {
    grid,
    moves,
    movesTotal,
    overloads,
    undoLeft,
    phase,
    beacons,
    lit: result.lit,
    energized: result.energized,
    conflicts: result.conflicts,
    chargeKey,
    surgeId,
    rotate,
    undo,
    charge,
    surge,
    forceEnd,
    ended: endedRef,
  };
}

export default useRound;
