export function starsFor(movesLeft: number, movesTotal: number): 0 | 1 | 2 | 3 {
  if (movesTotal <= 0) {
    return 1;
  }
  const ratio = movesLeft / movesTotal;
  if (ratio >= 0.5) {
    return 3;
  }
  if (ratio >= 0.2) {
    return 2;
  }
  return 1;
}
