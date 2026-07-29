import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '@/feature/product/type/product.interface';
import { clamp } from '@/helpers';

export interface CartItem extends Product {
  quantity: number;
}

interface CartActions {
  addToCart: (product: Product, quantity?: number) => number;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

interface CartState {
  actions: CartActions;
  items: CartItem[];
}

const lineCeiling = (available: number) => Math.max(available, 1);

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      actions: {
        addToCart: (product, quantity = 1) => {
          if (quantity <= 0) return 0;

          const existing = get().items.find((i) => i.id === product.id);
          const current = existing?.quantity ?? 0;
          const next = clamp(
            current + quantity,
            0,
            Math.max(product.available, 0),
          );
          const added = next - current;

          if (added <= 0) return 0;

          set((state) => ({
            items: existing
              ? state.items.map((i) =>
                  i.id === product.id ? { ...i, quantity: next } : i,
                )
              : [...state.items, { ...product, quantity: next }],
          }));

          return added;
        },
        removeFromCart: (productId) =>
          set((state) => ({
            items: state.items.filter((i) => i.id !== productId),
          })),
        updateQuantity: (productId, quantity) =>
          set((state) => ({
            items:
              quantity <= 0
                ? state.items.filter((i) => i.id !== productId)
                : state.items.map((i) =>
                    i.id === productId
                      ? {
                          ...i,
                          quantity: clamp(
                            quantity,
                            1,
                            lineCeiling(i.available),
                          ),
                        }
                      : i,
                  ),
          })),
        clearCart: () => set({ items: [] }),
      },
    }),
    {
      name: 'cart-storage',
      // Actions are behaviour, not state: never persist them.
      partialize: (state) => ({ items: state.items }),
    },
  ),
);
