import { describe, expect, it } from 'vitest';
import { formatCountdown, secondsUntil } from './payment-time';

describe('secondsUntil', () => {
  it('returns the whole seconds remaining until the deadline', () => {
    const now = Date.parse('2026-01-01T00:00:00Z');

    expect(secondsUntil('2026-01-01T00:05:00Z', now)).toBe(300);
  });

  it('clamps past deadlines to zero', () => {
    const now = Date.parse('2026-01-01T00:10:00Z');

    expect(secondsUntil('2026-01-01T00:05:00Z', now)).toBe(0);
  });

  it('treats null or invalid dates as already expired', () => {
    expect(secondsUntil(null)).toBe(0);
    expect(secondsUntil('not-a-date')).toBe(0);
  });
});

describe('formatCountdown', () => {
  it('formats minutes and seconds with padding', () => {
    expect(formatCountdown(300)).toBe('05:00');
    expect(formatCountdown(61)).toBe('01:01');
    expect(formatCountdown(0)).toBe('00:00');
  });
});
