/**
 * Motion primitives shared by every animated surface.
 *
 * The built-in CSS easings are too weak to read as intentional, so we keep
 * stronger custom curves here instead of re-declaring cubic-beziers per file.
 */

/** Strong ease-out. Entrances and responses: the UI answers the instant it is asked. */
export const EASE_OUT = 'cubic-bezier(0.23, 1, 0.32, 1)';

/** Ease-in reads as gravity. Only for things falling or leaving downward. */
export const EASE_IN = 'cubic-bezier(0.55, 0, 1, 0.45)';

/**
 * Whether the user asked their OS for less motion. Read at call time (never
 * cached) so a mid-session preference change is respected.
 */
export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;
