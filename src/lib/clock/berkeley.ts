/**
 * Pure Berkeley clock-sync helper. Given each clock's current counter,
 * returns the delta that should be applied to each clock so they all
 * converge on the rounded average.
 */
export function computeBerkeleyDeltas(
  counters: Record<number, number>,
): Record<number, number> {
  const ids = Object.keys(counters).map(Number);
  if (ids.length === 0) return {};
  const sum = ids.reduce((s, id) => s + counters[id], 0);
  const avg = Math.round(sum / ids.length);
  const deltas: Record<number, number> = {};
  for (const id of ids) {
    deltas[id] = avg - counters[id];
  }
  return deltas;
}
