import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { CartStatus } from '../store/cart.store';
import { CartAnnouncer } from './CartAnnouncer';

const cartState = vi.hoisted(() => ({
  hydrated: true,
  status: 'idle' as CartStatus,
  totalItems: 0,
}));

vi.mock('../hook/useCart', () => ({
  useCartData: () => ({
    status: cartState.status,
    totalItems: cartState.totalItems,
  }),
}));

vi.mock('../hook/useHydrated', () => ({
  useHydrated: () => cartState.hydrated,
}));

afterEach(() => {
  cleanup();
  cartState.hydrated = true;
  cartState.status = 'idle';
  cartState.totalItems = 0;
});

describe('CartAnnouncer', () => {
  it('anuncia una adición hecha antes de que el carrito termine de hidratar', () => {
    const view = render(<CartAnnouncer />);

    cartState.totalItems = 1;
    view.rerender(<CartAnnouncer />);

    cartState.status = 'ready';
    view.rerender(<CartAnnouncer />);

    expect(screen.getByRole('status').textContent).toContain(
      'Producto añadido al carrito',
    );
  });

  it('no anuncia como nueva una carga inicial con productos guardados', () => {
    const view = render(<CartAnnouncer />);

    cartState.status = 'ready';
    cartState.totalItems = 2;
    view.rerender(<CartAnnouncer />);

    expect(screen.getByRole('status').textContent).toBe('');
  });
});
