import { clamp } from '@/helpers';

/**
 * Geometry of a fly-to-cart animation. Pure maths over two rectangles: no DOM,
 * no React, so the trajectory can be reasoned about and tested on its own.
 */

/** Structural subset of `DOMRect` — lets callers pass plain objects in tests. */
export interface FlightRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface FlightGeometry {
  /** Viewport coordinates of the flying square's top-left corner at t=0. */
  startX: number;
  startY: number;
  /** Side of the flying square, in px. */
  size: number;
  /** Travel from the source centre to the target centre. */
  deltaX: number;
  deltaY: number;
  /** Scale the square shrinks to as it lands. */
  endScale: number;
}

/** Big enough to recognise the product, small enough not to cover the page. */
const MIN_SIZE = 44;
const MAX_SIZE = 84;

/** Nothing in the real world shrinks to nothing, so never land on `scale(0)`. */
const MIN_END_SCALE = 0.2;

const centreOf = (rect: FlightRect) => ({
  x: rect.left + rect.width / 2,
  y: rect.top + rect.height / 2,
});

/**
 * All values are in viewport coordinates because the flying node is
 * `position: fixed` — scroll offset must NOT be added.
 */
export const computeFlight = (
  from: FlightRect,
  to: FlightRect,
): FlightGeometry => {
  const size = clamp(Math.min(from.width, from.height), MIN_SIZE, MAX_SIZE);
  const source = centreOf(from);
  const target = centreOf(to);
  const targetSize = Math.min(to.width, to.height);

  return {
    startX: source.x - size / 2,
    startY: source.y - size / 2,
    size,
    deltaX: target.x - source.x,
    deltaY: target.y - source.y,
    endScale: clamp(targetSize / size, MIN_END_SCALE, 1),
  };
};
