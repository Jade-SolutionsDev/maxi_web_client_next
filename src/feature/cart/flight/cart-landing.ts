/**
 * "An item just reached the cart."
 *
 * Keeps the thing that throws (the product card) from knowing how the cart
 * reacts to being hit. Either side can change without touching the other.
 */

type LandingListener = () => void;

const listeners = new Set<LandingListener>();

/** Subscribes to landings. Returns the unsubscribe for `useEffect`. */
export const onCartLanding = (listener: LandingListener) => {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
};

export const emitCartLanding = () => {
  for (const listener of listeners) listener();
};
