import {ISLAND_COUNT} from './levels';
import type {IslandProgress} from './types';

export function starsFor(moves: number, limit: number): 0 | 1 | 2 | 3 {
  if (moves <= 0) {
    return 1;
  }
  if (moves <= Math.floor(limit * 0.6)) {
    return 3;
  }
  if (moves <= Math.floor(limit * 0.85)) {
    return 2;
  }
  return 1;
}

/**
 * Progression lives in module state seeded at app start - no native storage
 * dependency, no money, no rewards (the brief forbids them).
 */
const progress: IslandProgress[] = Array.from({length: ISLAND_COUNT}, (_, i) => ({
  unlocked: i === 0,
  stars: 0,
  bestMoves: 0,
}));

export const getProgress = (): IslandProgress[] => progress.map(p => ({...p}));

export const isUnlocked = (index: number): boolean =>
  index >= 0 && index < progress.length && progress[index].unlocked;

export function firstPlayableIsland(): number {
  for (let i = progress.length - 1; i >= 0; i--) {
    if (progress[i].unlocked && progress[i].stars === 0) {
      return i;
    }
  }
  for (let i = 0; i < progress.length; i++) {
    if (progress[i].unlocked) {
      return i;
    }
  }
  return 0;
}

export function recordWin(index: number, moves: number, stars: 0 | 1 | 2 | 3): void {
  const slot = progress[index];
  if (!slot) {
    return;
  }
  if (stars > slot.stars) {
    slot.stars = stars;
  }
  if (slot.bestMoves === 0 || moves < slot.bestMoves) {
    slot.bestMoves = moves;
  }
  const next = progress[index + 1];
  if (next) {
    next.unlocked = true;
  }
}

export interface MenuStats {
  islandsCleared: number;
  totalStars: number;
  bestMoves: number;
}

export function menuStats(): MenuStats {
  let islandsCleared = 0;
  let totalStars = 0;
  let bestMoves = 0;
  for (const p of progress) {
    if (p.stars > 0) {
      islandsCleared += 1;
    }
    totalStars += p.stars;
    if (p.bestMoves > 0 && (bestMoves === 0 || p.bestMoves < bestMoves)) {
      bestMoves = p.bestMoves;
    }
  }
  return {islandsCleared, totalStars, bestMoves};
}
