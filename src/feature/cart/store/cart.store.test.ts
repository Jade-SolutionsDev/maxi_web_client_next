import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Product } from '@/feature/product/type/product.interface';
import type { Cart, CartResult } from '../type/cart.interface';

const addCartLine = vi.fn<(input: unknown) => Promise<CartResult>>();
const setCartLineQuantity = vi.fn<(input: unknown) => Promise<CartResult>>();
const removeCartLine = vi.fn<(input: unknown) => Promise<CartResult>>();
const clearCartLines = vi.fn<() => Promise<CartResult>>();
const fetchCart = vi.fn<() => Promise<CartResult>>();
const mergeGuestCart = vi.fn();

vi.mock('../action/cart.action', () => ({
  addCartLine: (input: unknown) => addCartLine(input),
  setCartLineQuantity: (input: unknown) => setCartLineQuantity(input),
  removeCartLine: (input: unknown) => removeCartLine(input),
  clearCartLines: () => clearCartLines(),
  fetchCart: () => fetchCart(),
  mergeGuestCart: (input: unknown) => mergeGuestCart(input),
}));

const notifyCartFailure = vi.fn();
vi.mock('../feedback/cart.notify', () => ({
  notifyCartFailure: (...args: unknown[]) => notifyCartFailure(...args),
  notifyMergeReport: vi.fn(),
}));

const { useCartStore } = await import('./cart.store');

const product: Product = {
  id: 'cola',
  slug: 'cola-1l',
  name: 'Cola 1L',
  price: 10,
  measureUnit: 'unidad',
  available: 5,
};

const serverCart = (quantity: number): Cart => ({
  lines: [
    {
      productId: 'cola',
      slug: 'cola-1l',
      name: 'Cola 1L',
      measureUnit: 'unidad',
      quantity,
      unitPrice: 10,
      lineTotal: 10 * quantity,
      available: 5,
      isAvailable: true,
    },
  ],
  totalItems: quantity,
  subtotal: 10 * quantity,
});

const actions = () => useCartStore.getState().actions;
const state = () => useCartStore.getState();

const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

beforeEach(() => {
  vi.clearAllMocks();
  window.localStorage.clear();
  useCartStore.setState({
    mode: 'guest',
    status: 'idle',
    cart: { lines: [], totalItems: 0, subtotal: 0 },
    pending: [],
    lastSyncedAt: 0,
  });
});

describe('guest mode', () => {
  it('adds a line and persists it without touching the server', async () => {
    await actions().addToCart(product, 2);

    expect(addCartLine).not.toHaveBeenCalled();
    expect(state().cart.totalItems).toBe(2);
    expect(state().cart.subtotal).toBe(20);
    expect(window.localStorage.getItem('cart-storage')).toContain('cola');
  });

  it('clamps an add to the stock the catalog reported', async () => {
    const added = await actions().addToCart(product, 9);

    expect(added).toBe(5);
    expect(state().cart.totalItems).toBe(5);
  });

  it('reloads a persisted cart on hydrate', async () => {
    await actions().addToCart(product, 2);
    useCartStore.setState({ cart: { lines: [], totalItems: 0, subtotal: 0 } });

    actions().hydrateGuest();

    expect(state().cart.totalItems).toBe(2);
    expect(state().status).toBe('ready');
  });
});

describe('account mode', () => {
  beforeEach(() => {
    useCartStore.setState({
      mode: 'account',
      status: 'ready',
      cart: serverCart(1),
    });
  });

  it('applies the add immediately and then takes the server cart as truth', async () => {
    addCartLine.mockResolvedValue({ cart: serverCart(4) });

    const pendingAdd = actions().addToCart(product, 2);

    expect(state().cart.totalItems).toBe(3);

    await pendingAdd;

    expect(addCartLine).toHaveBeenCalledWith({
      productId: 'cola',
      quantity: 2,
    });
    expect(state().cart.totalItems).toBe(4);
  });

  it('collapses a burst of stepper clicks into one absolute PATCH', async () => {
    setCartLineQuantity.mockResolvedValue({ cart: serverCart(4) });
    vi.useFakeTimers();

    actions().updateQuantity('cola', 2);
    actions().updateQuantity('cola', 3);
    actions().updateQuantity('cola', 4);

    expect(state().cart.totalItems).toBe(4);
    expect(setCartLineQuantity).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(400);
    vi.useRealTimers();
    await flush();

    expect(setCartLineQuantity).toHaveBeenCalledOnce();
    expect(setCartLineQuantity).toHaveBeenCalledWith({
      productId: 'cola',
      quantity: 4,
    });
  });

  it('reads the cart back and warns when the server rejects the quantity', async () => {
    addCartLine.mockResolvedValue({
      failure: { kind: 'insufficient-stock', available: 2 },
    });
    fetchCart.mockResolvedValue({ cart: serverCart(2) });

    await actions().addToCart(product, 3);
    await flush();

    expect(notifyCartFailure).toHaveBeenCalledWith(
      { kind: 'insufficient-stock', available: 2 },
      'Cola 1L',
    );
    expect(fetchCart).toHaveBeenCalledOnce();
    expect(state().cart.totalItems).toBe(2);
  });

  it('marks the line pending only while its request is in flight', async () => {
    let release!: (value: CartResult) => void;
    addCartLine.mockReturnValue(
      new Promise<CartResult>((resolve) => {
        release = resolve;
      }),
    );

    const pendingAdd = actions().addToCart(product, 1);
    await flush();

    expect(state().pending).toEqual(['cola']);

    release({ cart: serverCart(2) });
    await pendingAdd;

    expect(state().pending).toEqual([]);
  });

  it('never writes an account cart into localStorage', async () => {
    addCartLine.mockResolvedValue({ cart: serverCart(2) });

    await actions().addToCart(product, 1);

    expect(window.localStorage.getItem('cart-storage')).toBeNull();
  });

  it('drops a pending PATCH when the line is removed first', async () => {
    removeCartLine.mockResolvedValue({
      cart: { lines: [], totalItems: 0, subtotal: 0 },
    });
    vi.useFakeTimers();

    actions().updateQuantity('cola', 3);
    actions().removeFromCart('cola');

    await vi.advanceTimersByTimeAsync(400);
    vi.useRealTimers();
    await flush();

    expect(setCartLineQuantity).not.toHaveBeenCalled();
    expect(removeCartLine).toHaveBeenCalledWith({ productId: 'cola' });
  });
});

describe('unauthenticated fallback', () => {
  beforeEach(() => {
    useCartStore.setState({
      mode: 'account',
      status: 'ready',
      cart: serverCart(2),
    });
  });

  it('falls back to guest instead of retrying against a session that is gone', async () => {
    addCartLine.mockResolvedValue({ failure: { kind: 'unauthenticated' } });

    await actions().addToCart(product, 1);
    await flush();

    expect(state().mode).toBe('guest');
    expect(state().status).toBe('ready');
    expect(fetchCart).not.toHaveBeenCalled();
  });

  it('says nothing when there was no session to lose', async () => {
    addCartLine.mockResolvedValue({ failure: { kind: 'unauthenticated' } });

    await actions().addToCart(product, 1);
    await flush();

    expect(notifyCartFailure).not.toHaveBeenCalled();
  });

  it('hands the on-screen lines to the guest cart so a reload keeps them', async () => {
    addCartLine.mockResolvedValue({ failure: { kind: 'unauthenticated' } });

    await actions().addToCart(product, 1);
    await flush();

    expect(window.localStorage.getItem('cart-storage')).toContain('cola');
    expect(state().cart.totalItems).toBe(3);
  });

  it('drops a debounced PATCH scheduled before the session was lost', async () => {
    fetchCart.mockResolvedValue({ failure: { kind: 'unauthenticated' } });
    vi.useFakeTimers();

    actions().updateQuantity('cola', 4);
    actions().refreshIfStale(0);

    await vi.advanceTimersByTimeAsync(400);
    vi.useRealTimers();
    await flush();

    expect(setCartLineQuantity).not.toHaveBeenCalled();
    expect(state().mode).toBe('guest');
  });
});

describe('refreshIfStale', () => {
  it('skips the refetch while the cart is still fresh', () => {
    useCartStore.setState({ mode: 'account', lastSyncedAt: Date.now() });

    actions().refreshIfStale(30_000);

    expect(fetchCart).not.toHaveBeenCalled();
  });

  it('refetches once the cart is older than the window', async () => {
    fetchCart.mockResolvedValue({ cart: serverCart(1) });
    useCartStore.setState({
      mode: 'account',
      status: 'ready',
      lastSyncedAt: Date.now() - 60_000,
    });

    actions().refreshIfStale(30_000);
    await flush();

    expect(fetchCart).toHaveBeenCalledOnce();
  });

  it('leaves a guest cart alone', () => {
    useCartStore.setState({ mode: 'guest', lastSyncedAt: 0 });

    actions().refreshIfStale(30_000);

    expect(fetchCart).not.toHaveBeenCalled();
  });
});

describe('adoptGuestCart', () => {
  it('merges the stored lines and only then clears them', async () => {
    await actions().addToCart(product, 2);
    mergeGuestCart.mockResolvedValue({
      cart: serverCart(2),
      report: { clamped: [], dropped: [] },
    });

    await actions().adoptGuestCart();

    expect(mergeGuestCart).toHaveBeenCalledWith([
      { productId: 'cola', quantity: 2, name: 'Cola 1L' },
    ]);
    expect(window.localStorage.getItem('cart-storage')).toBeNull();
    expect(state().mode).toBe('account');
  });

  it('keeps the guest cart when the merge fails', async () => {
    await actions().addToCart(product, 2);
    mergeGuestCart.mockResolvedValue({ failure: { kind: 'unknown' } });

    await actions().adoptGuestCart();

    expect(window.localStorage.getItem('cart-storage')).toContain('cola');
    expect(state().status).toBe('error');
  });

  it('just loads the server cart when nothing was stored', async () => {
    fetchCart.mockResolvedValue({ cart: serverCart(3) });

    await actions().adoptGuestCart();

    expect(mergeGuestCart).not.toHaveBeenCalled();
    expect(state().cart.totalItems).toBe(3);
  });
});
