import { describe, expect, it } from 'vitest';
import {
  formatCountdown,
  remainingSeconds,
  secondsUntil,
} from './payment-time';

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

describe('remainingSeconds', () => {
  const inThirtyMinutes = new Date(Date.now() + 30 * 60_000).toISOString();

  it('prefers what the server measured over the local clock', () => {
    expect(remainingSeconds(1800, inThirtyMinutes)).toBe(1800);
  });

  // The bug: a machine running an hour ahead read a live charge as expired and
  // the customer was told the payment failed.
  it('survives a browser clock running ahead of real time', () => {
    const anHourAhead = new Date(Date.now() - 60 * 60_000).toISOString();

    expect(secondsUntil(anHourAhead)).toBe(0);
    expect(remainingSeconds(1800, anHourAhead)).toBe(1800);
  });

  it('counts down by elapsed time, not by absolute clock', () => {
    expect(remainingSeconds(1800, inThirtyMinutes, 300)).toBe(1500);
  });

  it('never goes below zero', () => {
    expect(remainingSeconds(60, inThirtyMinutes, 600)).toBe(0);
  });

  it('falls back to the deadline when the server sent no count', () => {
    expect(remainingSeconds(null, inThirtyMinutes)).toBeGreaterThan(1700);
    expect(remainingSeconds(undefined, null)).toBe(0);
  });
});
