import { describe, it, expect } from 'vitest';
import { getSafeWeight, calculateNewStats, shuffleArray } from '../utils/ankiAlgorithm';

describe('ankiAlgorithm', () => {
  it('getSafeWeight should fallback to 100 if undefined', () => {
    expect(getSafeWeight(null)).toBe(100);
    expect(getSafeWeight(undefined)).toBe(100);
    expect(getSafeWeight({ currentWeight: 150 })).toBe(150);
    expect(getSafeWeight({ currentWeight: 0 })).toBe(0); // It returns 0 when explicitly set
  });

  it('calculateNewStats should correctly increase streak on correct answer', () => {
    const prev = { totalCorrect: 5, totalWrong: 2, currentWeight: 100, streak: 2 };
    const result = calculateNewStats(prev, true);
    expect(result.totalCorrect).toBe(6);
    expect(result.totalWrong).toBe(2);
    expect(result.streak).toBe(3);
    expect(result.currentWeight).toBeLessThan(100); // Weight should decrease
  });

  it('calculateNewStats should correctly reset streak and increase weight on wrong answer', () => {
    const prev = { totalCorrect: 5, totalWrong: 2, currentWeight: 100, streak: 2 };
    const result = calculateNewStats(prev, false);
    expect(result.totalCorrect).toBe(5);
    expect(result.totalWrong).toBe(3);
    expect(result.streak).toBe(0);
    expect(result.currentWeight).toBeGreaterThan(100); // Weight should increase heavily
  });

  it('shuffleArray should not mutate the original array if elements are primitives', () => {
    const arr = [1, 2, 3, 4, 5];
    const original = [...arr];
    const shuffled = shuffleArray(arr);
    
    expect(shuffled).toHaveLength(5);
    // Since it's random, we just check all elements are still there
    expect(shuffled.slice().sort()).toEqual([1, 2, 3, 4, 5]);
    expect(arr).toEqual(original); // The function creates a copy
  });
});
