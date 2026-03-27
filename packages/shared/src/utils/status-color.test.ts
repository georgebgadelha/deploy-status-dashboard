import { getStatusColor } from './status-color';

describe('getStatusColor', () => {
  it('returns green for success', () => {
    expect(getStatusColor('success')).toBe('#22c55e');
  });

  it('returns red for failed', () => {
    expect(getStatusColor('failed')).toBe('#ef4444');
  });

  it('returns amber for in_progress', () => {
    expect(getStatusColor('in_progress')).toBe('#f59e0b');
  });

  it('returns gray for cancelled', () => {
    expect(getStatusColor('cancelled')).toBe('#6b7280');
  });

  it('returns fallback gray for unknown status', () => {
    expect(getStatusColor('unknown' as any)).toBe('#6b7280');
  });
});
