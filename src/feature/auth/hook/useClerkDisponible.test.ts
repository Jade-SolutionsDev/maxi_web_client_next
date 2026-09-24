import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useClerkDisponible } from './useClerkDisponible';

const clerk = vi.hoisted(() => ({ loaded: false }));

vi.mock('@clerk/nextjs', () => ({
  useClerk: () => ({ loaded: clerk.loaded }),
}));

describe('useClerkDisponible', () => {
  beforeEach(() => {
    clerk.loaded = false;
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('no da nada por caído nada más montar', () => {
    const { result } = renderHook(() => useClerkDisponible());

    expect(result.current.caido).toBe(false);
    expect(result.current.listo).toBe(false);
  });

  it('sigue callado mientras la espera no se agota', () => {
    const { result } = renderHook(() => useClerkDisponible());

    act(() => {
      vi.advanceTimersByTime(7_000);
    });

    expect(result.current.caido).toBe(false);
  });

  it('da Clerk por caído cuando la espera se agota', () => {
    const { result } = renderHook(() => useClerkDisponible());

    act(() => {
      vi.advanceTimersByTime(8_000);
    });

    expect(result.current.caido).toBe(true);
  });

  it('no avisa si Clerk carga a tiempo', () => {
    const { result, rerender } = renderHook(() => useClerkDisponible());

    clerk.loaded = true;
    rerender();

    act(() => {
      vi.advanceTimersByTime(60_000);
    });

    expect(result.current.listo).toBe(true);
    expect(result.current.caido).toBe(false);
  });

  it('retira el aviso si Clerk acaba llegando tarde', () => {
    const { result, rerender } = renderHook(() => useClerkDisponible());

    act(() => {
      vi.advanceTimersByTime(8_000);
    });
    expect(result.current.caido).toBe(true);

    clerk.loaded = true;
    rerender();

    expect(result.current.caido).toBe(false);
  });
});
