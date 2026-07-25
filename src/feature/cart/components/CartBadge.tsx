'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import { EASE_OUT, prefersReducedMotion } from '@/lib/motion';

const MAX_BADGE_COUNT = 99;

const ROLL_MS = 240;

/** The column holds two slots, so half its height is exactly one digit. */
const ROLL_KEYFRAMES = [
  { transform: 'translateY(0)' },
  { transform: 'translateY(-50%)' },
];

interface CartBadgeProps {
  count: number;
}

const format = (count: number) =>
  count > MAX_BADGE_COUNT ? `${MAX_BADGE_COUNT}+` : String(count);

/**
 * Counter that rolls like an odometer instead of swapping the number.
 *
 * Both slots are always rendered; while settled they show the same value, so
 * the column sits at offset 0 and nothing moves. On a change the column slides
 * up by one slot, and only then does `previous` catch up — the swap happens
 * while the new value is already the one on screen, so there is no flash.
 */
export const CartBadge = ({ count }: CartBadgeProps) => {
  const [previous, setPrevious] = useState(count);
  const columnRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const column = columnRef.current;
    if (!column || previous === count) return;

    if (prefersReducedMotion()) {
      setPrevious(count);
      return;
    }

    const animation = column.animate(ROLL_KEYFRAMES, {
      duration: ROLL_MS,
      easing: EASE_OUT,
      // Hold the rolled position until React has committed the settled markup.
      fill: 'forwards',
    });

    animation.finished.then(() => setPrevious(count)).catch(() => {});

    return () => animation.cancel();
  }, [count, previous]);

  return (
    <span
      aria-hidden='true'
      className='absolute -top-0.5 -right-1 flex h-4 min-w-4 items-start justify-center overflow-hidden rounded-full bg-orange px-1 text-[0.625rem] font-bold text-heading leading-none tabular-nums ring-2 ring-primary'
    >
      <span ref={columnRef} className='flex flex-col'>
        <span className='flex h-4 items-center justify-center'>
          {format(previous)}
        </span>
        <span className='flex h-4 items-center justify-center'>
          {format(count)}
        </span>
      </span>
    </span>
  );
};
