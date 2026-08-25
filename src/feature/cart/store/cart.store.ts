import { create } from 'zustand';
import type { Product } from '@/feature/product/type/product.interface';
import { clamp } from '@/helpers';
import {
  addCartLine,
  clearCartLines,
  fetchCart,
  mergeGuestCart,
  removeCartLine,
  setCartLineQuantity,
} from '../action/cart.action';
import { toGuestCart, toGuestLine } from '../adapter/guest-cart.adapter';
import { notifyCartFailure, notifyMergeReport } from '../feedback/cart.notify';
import { recalculate } from '../lib/cart-math';
import {
  clearGuestLines,
  readGuestLines,
  writeGuestLines,
} from '../lib/guest-storage';
import { createMutationQueue } from '../lib/mutation-queue';
import {
  type Cart,
  type CartLine,
  type CartResult,
  EMPTY_CART,
  type GuestLine,
} from '../type/cart.interface';

const QUANTITY_DEBOUNCE_MS = 350;

export type CartMode = 'guest' | 'account';
export type CartStatus = 'idle' | 'loading' | 'ready' | 'error';

interface CartActions {
  addToCart: (product: Product, quantity?: number) => Promise<number>;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  adjustToAvailable: (productId: string) => void;
  hydrateGuest: () => void;
  loadAccountCart: () => Promise<void>;
  adoptGuestCart: () => Promise<void>;
  refreshIfStale: (maxAgeMs: number) => void;
}

interface CartState {
  mode: CartMode;
  status: CartStatus;
  cart: Cart;
  pending: string[];
  lastSyncedAt: number;
  actions: CartActions;
}

const enqueue = createMutationQueue();
const debouncers = new Map<string, ReturnType<typeof setTimeout>>();

const cancelDebounce = (productId: string) => {
  const timer = debouncers.get(productId);

  if (timer) {
    clearTimeout(timer);
    debouncers.delete(productId);
  }
};

const toGuestLines = (lines: CartLine[]): GuestLine[] =>
  lines.map(
    ({ lineTotal: _lineTotal, isAvailable: _isAvailable, ...line }) => line,
  );

const nameOf = (cart: Cart, productId: string) =>
  cart.lines.find((line) => line.productId === productId)?.name ??
  'el producto';

export const useCartStore = create<CartState>()((set, get) => {
  const setGuestCart = (lines: CartLine[]) => {
    const cart = recalculate(lines);

    writeGuestLines(toGuestLines(cart.lines));
    set({ cart });
  };

  let cartSyncToken = 0;

  const nextCartSyncToken = () => ++cartSyncToken;

  const setServerCart = (token: number, cart: Cart) => {
    if (token !== cartSyncToken) return;

    set({ cart, status: 'ready', lastSyncedAt: Date.now() });
  };

  const cancelAllDebounces = () => {
    for (const productId of debouncers.keys()) cancelDebounce(productId);
  };

  const enterGuestMode = () => {
    cancelAllDebounces();
    set({
      mode: 'guest',
      status: 'ready',
      cart: toGuestCart(readGuestLines()),
      pending: [],
    });
  };

  const demoteToGuest = () => {
    const { lines } = get().cart;

    if (lines.length > 0) writeGuestLines(toGuestLines(lines));

    enterGuestMode();
  };

  const markPending = (productId: string) =>
    set((state) => ({ pending: [...state.pending, productId] }));

  const clearPending = (productId: string) =>
    set((state) => {
      const index = state.pending.indexOf(productId);

      if (index === -1) return state;

      return { pending: state.pending.filter((_, at) => at !== index) };
    });

  const reconcile = async () => {
    const token = nextCartSyncToken();
    const result = await enqueue(fetchCart);

    if (result.cart) {
      setServerCart(token, result.cart);
      return;
    }

    if (result.failure.kind === 'unauthenticated') {
      demoteToGuest();
      return;
    }

    set({ status: 'error' });
  };

  const runMutation = async (
    productId: string,
    call: () => Promise<CartResult>,
  ) => {
    markPending(productId);
    const token = nextCartSyncToken();

    try {
      const result = await enqueue(call);

      if (result.cart) {
        setServerCart(token, result.cart);
        return;
      }

      if (result.failure.kind === 'unauthenticated') {
        demoteToGuest();
        return;
      }

      notifyCartFailure(result.failure, nameOf(get().cart, productId));
      await reconcile();
    } finally {
      clearPending(productId);
    }
  };

  const patchLines = (update: (lines: CartLine[]) => CartLine[]) =>
    set((state) => ({ cart: recalculate(update(state.cart.lines)) }));

  return {
    mode: 'guest',
    status: 'idle',
    cart: EMPTY_CART,
    pending: [],
    lastSyncedAt: 0,

    actions: {
      addToCart: async (product, quantity = 1) => {
        if (quantity <= 0) return 0;

        const { mode, cart } = get();
        const existing = cart.lines.find(
          (line) => line.productId === product.id,
        );
        const current = existing?.quantity ?? 0;
        const next = clamp(
          current + quantity,
          0,
          Math.max(product.available, 0),
        );
        const added = next - current;

        if (added <= 0) return 0;

        const lines = existing
          ? cart.lines.map((line) =>
              line.productId === product.id
                ? { ...line, quantity: next }
                : line,
            )
          : [
              ...cart.lines,
              {
                ...toGuestLine(product, next),
                lineTotal: 0,
                isAvailable: true,
              },
            ];

        if (mode === 'guest') {
          setGuestCart(lines);
          return added;
        }

        patchLines(() => lines);
        await runMutation(product.id, () =>
          addCartLine({ productId: product.id, quantity: added }),
        );

        return added;
      },

      updateQuantity: (productId, quantity) => {
        const { mode, cart, actions } = get();

        if (quantity <= 0) {
          actions.removeFromCart(productId);
          return;
        }

        const line = cart.lines.find((item) => item.productId === productId);

        if (!line) return;

        const next = clamp(quantity, 1, Math.max(line.available, 1));

        if (mode === 'guest') {
          setGuestCart(
            cart.lines.map((item) =>
              item.productId === productId ? { ...item, quantity: next } : item,
            ),
          );
          return;
        }

        patchLines((lines) =>
          lines.map((item) =>
            item.productId === productId ? { ...item, quantity: next } : item,
          ),
        );

        cancelDebounce(productId);
        debouncers.set(
          productId,
          setTimeout(() => {
            debouncers.delete(productId);

            const settled = get().cart.lines.find(
              (item) => item.productId === productId,
            );

            if (!settled) return;

            void runMutation(productId, () =>
              setCartLineQuantity({ productId, quantity: settled.quantity }),
            );
          }, QUANTITY_DEBOUNCE_MS),
        );
      },

      removeFromCart: (productId) => {
        const { mode, cart } = get();

        cancelDebounce(productId);

        const remaining = cart.lines.filter(
          (line) => line.productId !== productId,
        );

        if (mode === 'guest') {
          setGuestCart(remaining);
          return;
        }

        patchLines(() => remaining);
        void runMutation(productId, () => removeCartLine({ productId }));
      },

      clearCart: () => {
        const { mode } = get();

        cancelAllDebounces();

        if (mode === 'guest') {
          setGuestCart([]);
          return;
        }

        set({ cart: EMPTY_CART });
        void runMutation('cart', clearCartLines);
      },

      adjustToAvailable: (productId) => {
        const line = get().cart.lines.find(
          (item) => item.productId === productId,
        );

        if (!line) return;

        if (line.available < 1) {
          get().actions.removeFromCart(productId);
          return;
        }

        get().actions.updateQuantity(productId, line.available);
      },

      hydrateGuest: enterGuestMode,

      loadAccountCart: async () => {
        set({ mode: 'account', status: 'loading' });
        const token = nextCartSyncToken();

        const result = await enqueue(fetchCart);

        if (result.cart) {
          setServerCart(token, result.cart);
          return;
        }

        if (result.failure.kind === 'unauthenticated') {
          demoteToGuest();
          return;
        }

        set({ status: 'error' });
      },

      adoptGuestCart: async () => {
        const stored = readGuestLines();

        if (stored.length === 0) {
          await get().actions.loadAccountCart();
          return;
        }

        set({ mode: 'account', status: 'loading' });
        const token = nextCartSyncToken();

        const result = await enqueue(() =>
          mergeGuestCart(
            stored.map(({ productId, quantity, name }) => ({
              productId,
              quantity,
              name,
            })),
          ),
        );

        if (!result.cart) {
          if (result.failure.kind === 'unauthenticated') {
            demoteToGuest();
            return;
          }

          set({ status: 'error' });
          notifyCartFailure(result.failure, 'tu carrito');
          return;
        }

        // Only once the server has taken the lines: clearing earlier turns a
        // failed merge into a cart the customer cannot get back.
        clearGuestLines();
        setServerCart(token, result.cart);
        notifyMergeReport(result.report);
      },

      refreshIfStale: (maxAgeMs) => {
        const { mode, status, lastSyncedAt } = get();

        if (mode !== 'account' || status === 'loading') return;
        if (Date.now() - lastSyncedAt < maxAgeMs) return;

        void reconcile();
      },
    },
  };
});
