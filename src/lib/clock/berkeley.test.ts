import { describe, it, expect } from 'vitest';
import { computeBerkeleyDeltas } from './berkeley';

describe('computeBerkeleyDeltas', () => {
  it('returns zero deltas when all counters are equal', () => {
    expect(computeBerkeleyDeltas({ 0: 10, 1: 10, 2: 10, 3: 10 })).toEqual({
      0: 0, 1: 0, 2: 0, 3: 0,
    });
  });

  it('moves counters toward the average', () => {
    // avg = (0 + 10 + 20 + 30) / 4 = 15
    expect(computeBerkeleyDeltas({ 0: 0, 1: 10, 2: 20, 3: 30 })).toEqual({
      0: 15, 1: 5, 2: -5, 3: -15,
    });
  });

  it('rounds the average with Math.round (halves go up)', () => {
    // avg = (0 + 1) / 2 = 0.5 -> Math.round(0.5) === 1
    expect(computeBerkeleyDeltas({ 0: 0, 1: 1 })).toEqual({
      0: 1, 1: 0,
    });
  });

  it('returns an empty object for empty input', () => {
    expect(computeBerkeleyDeltas({})).toEqual({});
  });
});
