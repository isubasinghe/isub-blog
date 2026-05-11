export type VectorClock = Record<number, number>;

/**
 * Merge a received vector clock into the receiver's vector clock:
 *   1. Take the elementwise max across all keys present in either clock.
 *   2. Increment the receiver's own component by 1 (the receive event).
 *
 * Pure: does not mutate either input.
 */
export function mergeVectorClocks(
  self: VectorClock,
  received: VectorClock,
  selfId: number,
): VectorClock {
  const result: VectorClock = {};
  const allIds = new Set<number>();
  for (const k of Object.keys(self)) allIds.add(Number(k));
  for (const k of Object.keys(received)) allIds.add(Number(k));
  for (const id of allIds) {
    result[id] = Math.max(self[id] ?? 0, received[id] ?? 0);
  }
  result[selfId] = (result[selfId] ?? 0) + 1;
  return result;
}
