import { calculate } from '../../../messages/time/repeating';

describe('calculate', () => {
  it('should be able to calculate from 1650970205', () => {
    const { unixes } = calculate(1650970205, {
      offset: 5,
      interval: 120,
      duration: 10,
    });
    expect(unixes.ongoing).toBeUndefined();
    expect(unixes.upcoming).toBe(1650971100);
    for (let i = 0; i < 12; i++) {
      expect(unixes.occurrences[i]).toBe(1650956700 + i * 120 * 60);
    }
  });
});
