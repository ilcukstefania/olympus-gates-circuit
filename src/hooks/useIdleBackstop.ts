import { useCallback, useEffect, useRef } from 'react';

import {
  AMBIENT_SURGE_MS,
  IDLE_HARD_CAP_MS,
  IDLE_INPUT_GAP_MS,
  IDLE_MOUNT_FLOOR_MS,
  IDLE_TICK_MS,
} from '../constants/config';

interface Options {
  active: boolean;
  onExpire: () => void;
  onSurge?: () => void;
}

/**
 * Guarantees a round always terminates, even with zero player input.
 *   soft ceiling: max(mount + 26s, lastInput + 9s)
 *   hard ceiling: mount + 40s, which no amount of tapping can push back
 * A mid-flight "ambient surge" also guarantees the idle frame differs from
 * the very first frame of the board.
 */
export function useIdleBackstop({ active, onExpire, onSurge }: Options) {
  const mountAtRef = useRef(Date.now());
  const lastInputAtRef = useRef(Date.now());
  const firedRef = useRef(false);
  const surgedRef = useRef(false);

  const expireRef = useRef(onExpire);
  const surgeRef = useRef(onSurge);
  expireRef.current = onExpire;
  surgeRef.current = onSurge;

  const registerInput = useCallback(() => {
    lastInputAtRef.current = Date.now();
  }, []);

  useEffect(() => {
    if (!active) {
      return;
    }
    const id = setInterval(() => {
      if (firedRef.current) {
        return;
      }
      const now = Date.now();
      const mountAt = mountAtRef.current;

      if (!surgedRef.current && now >= mountAt + AMBIENT_SURGE_MS) {
        surgedRef.current = true;
        if (surgeRef.current) {
          surgeRef.current();
        }
      }

      const soft = Math.max(
        mountAt + IDLE_MOUNT_FLOOR_MS,
        lastInputAtRef.current + IDLE_INPUT_GAP_MS,
      );
      const hard = mountAt + IDLE_HARD_CAP_MS;

      if (now >= soft || now >= hard) {
        firedRef.current = true;
        expireRef.current();
      }
    }, IDLE_TICK_MS);

    return () => clearInterval(id);
  }, [active]);

  return { registerInput };
}

export default useIdleBackstop;
