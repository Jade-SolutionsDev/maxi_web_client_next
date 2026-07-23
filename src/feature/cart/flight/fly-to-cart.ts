import { EASE_IN } from '@/lib/motion';
import { emitCartLanding } from './cart-landing';
import { computeFlight } from './flight-path';
import { resolveFlightImage } from './flight-source';
import { getFlightTarget } from './flight-target';

/**
 * Throws a ghost of the product across the screen and into the cart.
 *
 * Built with the Web Animations API rather than `@keyframes`: WAAPI animations
 * are interruptible, expose `finished` as a promise, and — animating only
 * `transform`/`opacity` — run off the main thread.
 *
 * The overlay is plain DOM on purpose. It is ephemeral, non-interactive and
 * `aria-hidden`; putting it in React state would cost a provider, a portal and
 * a re-render per flight, for a node that deletes itself when it lands.
 */

/** Long for a UI animation, but here the trajectory IS the message. */
const DURATION_MS = 720;

/** Fraction of the flight after which the ghost fades into the cart. */
const FADE_START = 0.82;

/**
 * Horizontal easing. Deliberately milder than the app's UI ease-out: at half
 * time it is ~74% across while the vertical axis is only ~13% along, and that
 * gap between the two axes IS the curvature. A stronger ease-out (0.23, 1,
 * 0.32, 1) reaches 97% horizontally by half time, which reads as an L, not an arc.
 */
const EASE_TRAVERSE = 'cubic-bezier(0.25, 0.35, 0.5, 1)';

/** Above the sticky header (z-20), below the cart sheet (z-50). */
const FLIGHT_Z_INDEX = '40';

interface FlyToCartOptions {
  /**
   * Element the flight starts from — its box defines the ghost's size, and the
   * image it contains (or is) becomes the ghost. Falls back to a plain token
   * when there is no image to be found.
   */
  sourceEl: HTMLElement;
}

const createGhost = (imageSrc?: string) => {
  const ghost = imageSrc
    ? document.createElement('img')
    : document.createElement('div');

  if (ghost instanceof HTMLImageElement && imageSrc) {
    ghost.src = imageSrc;
    ghost.alt = '';
  }

  Object.assign(ghost.style, {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    borderRadius: '9999px',
    padding: '6px',
    background: imageSrc
      ? 'var(--color-background, #ffffff)'
      : 'var(--color-primary, #3db98c)',
    boxShadow: '0 8px 24px rgb(0 0 0 / 0.18)',
    willChange: 'transform, opacity',
  } satisfies Partial<CSSStyleDeclaration>);

  return ghost;
};

export const flyToCart = ({ sourceEl }: FlyToCartOptions) => {
  const target = getFlightTarget();
  const imageSrc = resolveFlightImage(sourceEl);

  // Decoration must never break the real action: bail out quietly.
  if (!target) {
    emitCartLanding();
    return;
  }

  const geometry = computeFlight(
    sourceEl.getBoundingClientRect(),
    target.getBoundingClientRect(),
  );

  const carrier = document.createElement('div');
  carrier.setAttribute('aria-hidden', 'true');
  Object.assign(carrier.style, {
    position: 'fixed',
    left: `${geometry.startX}px`,
    top: `${geometry.startY}px`,
    width: `${geometry.size}px`,
    height: `${geometry.size}px`,
    zIndex: FLIGHT_Z_INDEX,
    pointerEvents: 'none',
    willChange: 'transform',
  } satisfies Partial<CSSStyleDeclaration>);

  const ghost = createGhost(imageSrc);
  carrier.append(ghost);
  document.body.append(carrier);

  // The arc, with no path maths: the carrier owns the horizontal axis with an
  // ease-out, the ghost owns the vertical axis with an ease-in. Two different
  // easings composing over the same duration draw a parabola.
  const horizontal = carrier.animate(
    [
      { transform: 'translate3d(0, 0, 0)' },
      { transform: `translate3d(${geometry.deltaX}px, 0, 0)` },
    ],
    { duration: DURATION_MS, easing: EASE_TRAVERSE, fill: 'forwards' },
  );

  ghost.animate(
    [
      {
        offset: 0,
        transform: 'translate3d(0, 0, 0) scale(1) rotate(0deg)',
        opacity: 1,
      },
      { offset: FADE_START, opacity: 1 },
      {
        offset: 1,
        transform: `translate3d(0, ${geometry.deltaY}px, 0) scale(${geometry.endScale}) rotate(14deg)`,
        opacity: 0,
      },
    ],
    { duration: DURATION_MS, easing: EASE_IN, fill: 'forwards' },
  );

  horizontal.finished
    .then(() => {
      carrier.remove();
      emitCartLanding();
    })
    .catch(() => {
      // Cancelled mid-flight (e.g. navigation): drop the node, skip the impact.
      carrier.remove();
    });
};
