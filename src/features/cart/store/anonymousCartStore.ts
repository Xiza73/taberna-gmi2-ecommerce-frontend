import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AnonymousCartItem } from '@/types/cart';
import type { Product } from '@/types/product';

interface AnonymousCartState {
  items: AnonymousCartItem[];
  addItem: (product: Product, quantity: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
}

/**
 * Cart anónimo persistido en localStorage. Solo se usa cuando NO hay sesión
 * activa. Al loguear, los items se mergean al cart del back via
 * `useMergeAnonymousCartOnLogin` y este store se limpia.
 *
 * Snapshot: guardamos productName, productSlug, productImage, price y stock
 * al momento de agregar. El precio mostrado en el drawer es el snapshot —
 * si el back cambia el precio antes del checkout, el back lo recalcula al
 * crear la orden.
 */
export const useAnonymousCartStore = create<AnonymousCartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (product, quantity) => {
        set((state) => {
          const existing = state.items.find((i) => i.productId === product.id);
          const maxStock = Math.max(product.stock, 1);
          if (existing) {
            const nextQty = Math.min(existing.quantity + quantity, maxStock);
            return {
              items: state.items.map((i) =>
                i.productId === product.id ? { ...i, quantity: nextQty, maxStock } : i,
              ),
            };
          }
          const safeQty = Math.min(Math.max(quantity, 1), maxStock);
          const newItem: AnonymousCartItem = {
            productId: product.id,
            productName: product.name,
            productSlug: product.slug,
            productImage: product.images[0] ?? null,
            price: product.price,
            quantity: safeQty,
            maxStock,
          };
          return { items: [...state.items, newItem] };
        });
      },
      updateQuantity: (productId, quantity) => {
        set((state) => ({
          items: state.items
            .map((i) =>
              i.productId === productId
                ? { ...i, quantity: Math.min(Math.max(quantity, 1), i.maxStock) }
                : i,
            )
            .filter((i) => i.quantity > 0),
        }));
      },
      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        }));
      },
      clear: () => set({ items: [] }),
    }),
    {
      name: 'gmi2.ecommerce.anonymousCart',
      version: 1,
    },
  ),
);
