import { describe, expect, it } from 'vitest';
import {
  computeFlight,
  type FlightRect,
} from '@/feature/cart/flight/flight-path';

const rect = (
  left: number,
  top: number,
  width: number,
  height: number,
): FlightRect => ({ left, top, width, height });

describe('computeFlight', () => {
  it('travels from the source centre to the target centre', () => {
    const geometry = computeFlight(
      rect(100, 400, 200, 200),
      rect(900, 20, 44, 44),
    );

    // source centre (200, 500) → target centre (922, 42)
    expect(geometry.deltaX).toBe(722);
    expect(geometry.deltaY).toBe(-458);
  });

  it('centres the flying square on the source', () => {
    const geometry = computeFlight(
      rect(100, 400, 200, 200),
      rect(900, 20, 44, 44),
    );

    expect(geometry.startX).toBe(200 - geometry.size / 2);
    expect(geometry.startY).toBe(500 - geometry.size / 2);
  });

  it('clamps the square to the readable size range', () => {
    const tiny = computeFlight(rect(0, 0, 12, 12), rect(900, 20, 44, 44));
    const huge = computeFlight(rect(0, 0, 800, 800), rect(900, 20, 44, 44));

    expect(tiny.size).toBe(44);
    expect(huge.size).toBe(84);
  });

  it('never lands on a scale of zero', () => {
    const geometry = computeFlight(rect(0, 0, 800, 800), rect(900, 20, 2, 2));

    expect(geometry.endScale).toBe(0.2);
  });

  it('never grows the ghost while landing', () => {
    const geometry = computeFlight(rect(0, 0, 60, 60), rect(900, 20, 400, 400));

    expect(geometry.endScale).toBe(1);
  });

  it('produces finite values when source and target coincide', () => {
    const geometry = computeFlight(rect(0, 0, 0, 0), rect(0, 0, 0, 0));

    expect(geometry.deltaX).toBe(0);
    expect(geometry.deltaY).toBe(0);
    expect(Number.isFinite(geometry.endScale)).toBe(true);
  });
});
