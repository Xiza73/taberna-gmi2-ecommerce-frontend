import { create } from 'zustand';

interface WishlistState {
  /** Set de productIds que están en la wishlist del customer logueado.
   *  Se hidrata del server vía `useWishlist` — sin persist. */
  ids: Set<string>;
  setIds: (ids: Iterable<string>) => void;
  add: (id: string) => void;
  remove: (id: string) => void;
  has: (id: string) => boolean;
  clear: () => void;
}

/**
 * Store cliente de la wishlist (solo IDs). Sirve para que componentes
 * livianos (ej: el `<WishlistHeartButton>` del `ProductCard`) sepan si un
 * producto está en la wishlist sin tener que correr `useWishlist` en cada
 * card y traer el array completo.
 *
 * Fuente de verdad: el server. Este store siempre se sincroniza desde
 * el `useWishlist` y desde los handlers optimistas de las mutations.
 */
export const useWishlistStore = create<WishlistState>((set, get) => ({
  ids: new Set<string>(),
  setIds: (ids) => set({ ids: new Set(ids) }),
  add: (id) =>
    set((state) => {
      if (state.ids.has(id)) return state;
      const next = new Set(state.ids);
      next.add(id);
      return { ids: next };
    }),
  remove: (id) =>
    set((state) => {
      if (!state.ids.has(id)) return state;
      const next = new Set(state.ids);
      next.delete(id);
      return { ids: next };
    }),
  has: (id) => get().ids.has(id),
  clear: () => set({ ids: new Set<string>() }),
}));
