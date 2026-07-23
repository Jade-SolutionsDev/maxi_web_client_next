import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '@/feature/product/type/product.interface';

export interface CartItem extends Product {
  quantity: number;
}

interface CartActions {
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

interface CartState {
  actions: CartActions;
  items: CartItem[];
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      actions: {
        addToCart: (product, quantity = 1) =>
          set((state) => {
            if (quantity <= 0) return state;

            const isInCart = state.items.some((i) => i.id === product.id);

            return {
              items: isInCart
                ? state.items.map((i) =>
                    i.id === product.id
                      ? { ...i, quantity: i.quantity + quantity }
                      : i,
                  )
                : [...state.items, { ...product, quantity }],
            };
          }),
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
                    i.id === productId ? { ...i, quantity } : i,
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
