import { formatDate } from './format-date';

describe('formatDate', () => {
  it('formats a valid ISO date string', () => {
    const result = formatDate('2024-01-15T10:30:00Z');
    expect(result).toContain('Jan');
    expect(result).toContain('15');
    expect(result).toContain('2024');
  });

  it('formats a Date object', () => {
    const result = formatDate(new Date('2024-06-01T14:00:00Z'));
    expect(result).toContain('Jun');
    expect(result).toContain('1');
  });

  it('returns "Invalid date" for bad input', () => {
    expect(formatDate('not-a-date')).toBe('Invalid date');
  });

  it('returns "Invalid date" for empty string', () => {
    expect(formatDate('')).toBe('Invalid date');
  });
});
