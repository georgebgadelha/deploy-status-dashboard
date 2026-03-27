import { formatDuration } from './format-duration';

describe('formatDuration', () => {
  it('formats seconds under 60', () => {
    expect(formatDuration(42)).toBe('42s');
  });

  it('rounds fractional seconds', () => {
    expect(formatDuration(42.7)).toBe('43s');
  });

  it('formats exactly 60 seconds as 1m', () => {
    expect(formatDuration(60)).toBe('1m');
  });

  it('formats minutes and seconds', () => {
    expect(formatDuration(90)).toBe('1m 30s');
  });

  it('returns 0s for zero', () => {
    expect(formatDuration(0)).toBe('0s');
  });

  it('returns 0s for negative values', () => {
    expect(formatDuration(-10)).toBe('0s');
  });
});
