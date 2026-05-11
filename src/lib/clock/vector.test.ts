import { describe, it, expect } from 'vitest';
import { mergeVectorClocks } from './vector';

describe('mergeVectorClocks', () => {
  it('takes the elementwise max then bumps self', () => {
    // self={0:3, 1:1}, received={0:2, 1:5}, selfId=0
    // max => {0:3, 1:5}; then bump 0 => {0:4, 1:5}
    expect(mergeVectorClocks({ 0: 3, 1: 1 }, { 0: 2, 1: 5 }, 0)).toEqual({
      0: 4,
      1: 5,
    });
  });

  it('introduces new keys from received vclock', () => {
    expect(mergeVectorClocks({ 0: 1 }, { 1: 4 }, 0)).toEqual({
      0: 2,
      1: 4,
    });
  });

  it('increments self component when received is empty', () => {
    expect(mergeVectorClocks({ 0: 5 }, {}, 0)).toEqual({ 0: 6 });
  });

  it('introduces selfId entry if missing', () => {
    expect(mergeVectorClocks({}, { 1: 2 }, 0)).toEqual({ 0: 1, 1: 2 });
  });

  it('does not mutate inputs', () => {
    const self = { 0: 1 };
    const received = { 1: 2 };
    mergeVectorClocks(self, received, 0);
    expect(self).toEqual({ 0: 1 });
    expect(received).toEqual({ 1: 2 });
  });
});
