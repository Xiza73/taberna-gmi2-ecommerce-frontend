import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { wishlistApi } from '@/api/wishlistApi';
import type { WishlistItem } from '@/types/wishlist';
import { useWishlistStore } from '../store/wishlistStore';

export const wishlistKeys = {
  all: ['wishlist'] as const,
};

/**
 * Lista la wishlist del customer logueado. Cada vez que cambia el `data`,
 * sincroniza el `useWishlistStore` con los productIds que vinieron del
 * server (fuente de verdad). El `WishlistHeartButton` lee del store —
 * así no tenemos que correr esta query en cada card del catálogo.
 *
 * Por default queda deshabilitada — el caller decide (vía `enabled`) si
 * hay sesión y vale la pena pegarle a `/wishlist`. Esto permite usar el
 * hook desde un init layer (ej: app-level) sin disparar 401s para
 * customers anónimos.
 */
interface UseWishlistOptions {
  enabled?: boolean;
}

export function useWishlist(options: UseWishlistOptions = {}) {
  const setIds = useWishlistStore((s) => s.setIds);
  const clear = useWishlistStore((s) => s.clear);
  const enabled = options.enabled ?? true;

  const query = useQuery({
    queryKey: wishlistKeys.all,
    queryFn: wishlistApi.list,
    enabled,
    staleTime: 30_000,
  });

  // Sync store from server data. Si el query se deshabilita o no hay data,
  // dejamos el store como esté (el caller de logout limpia explícitamente).
  useEffect(() => {
    if (query.data) {
      setIds(query.data.map((item) => item.productId));
    }
  }, [query.data, setIds]);

  // Si quedan colgando ids del store cuando la query se deshabilita
  // (ej: logout que cambia `enabled` a false), limpiamos.
  useEffect(() => {
    if (!enabled) clear();
  }, [enabled, clear]);

  return query;
}

export function useAddToWishlist() {
  const qc = useQueryClient();
  const add = useWishlistStore((s) => s.add);
  const remove = useWishlistStore((s) => s.remove);

  return useMutation({
    mutationFn: (productId: string) => wishlistApi.add(productId),
    onMutate: (productId) => {
      // Optimistic: marcamos como "en wishlist" antes de la respuesta.
      add(productId);
      return { productId };
    },
    onError: (_err, productId) => {
      // Rollback: si falló, sacar del store.
      remove(productId);
    },
    onSettled: () => {
      void qc.invalidateQueries({ queryKey: wishlistKeys.all });
    },
  });
}

export function useRemoveFromWishlist() {
  const qc = useQueryClient();
  const removeFromStore = useWishlistStore((s) => s.remove);
  const addToStore = useWishlistStore((s) => s.add);

  return useMutation({
    mutationFn: (productId: string) => wishlistApi.remove(productId),
    onMutate: async (productId) => {
      await qc.cancelQueries({ queryKey: wishlistKeys.all });

      const previous = qc.getQueryData<WishlistItem[]>(wishlistKeys.all);

      // Optimistic: removemos del cache y del store.
      qc.setQueryData<WishlistItem[]>(wishlistKeys.all, (old) =>
        old ? old.filter((it) => it.productId !== productId) : old,
      );
      removeFromStore(productId);

      return { previous, productId };
    },
    onError: (_err, productId, ctx) => {
      // Rollback cache + store.
      if (ctx?.previous) {
        qc.setQueryData<WishlistItem[]>(wishlistKeys.all, ctx.previous);
      }
      addToStore(productId);
    },
    onSettled: () => {
      void qc.invalidateQueries({ queryKey: wishlistKeys.all });
    },
  });
}
