import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { cartApi } from '@/api/cartApi';
import { useAuth } from '@/features/auth';
import { useAnonymousCartStore } from '../store/anonymousCartStore';
import { cartKeys } from './useServerCart';

/**
 * Detecta cuando un usuario pasa de NO autenticado → autenticado y mergea
 * el cart anónimo (localStorage) al cart server. Para cada item local
 * llama a `POST /cart/items` (que el back suma cantidades si el producto
 * ya está). Después limpia el store anónimo y refresca el cart server.
 *
 * Se monta una sola vez en `RootLayout`. Es idempotente — si no hay items
 * locales o ya se mergeó en esta sesión, no hace nada.
 *
 * Errores por ítem se ignoran silenciosamente (best-effort): no queremos
 * que un producto sin stock bloquee el merge entero. Lo que falle queda
 * fuera; el resto se preserva.
 */
export function useMergeAnonymousCartOnLogin() {
  const { isAuthenticated, isLoading } = useAuth();
  const localItems = useAnonymousCartStore((s) => s.items);
  const clearLocal = useAnonymousCartStore((s) => s.clear);
  const qc = useQueryClient();
  const wasAuthedRef = useRef<boolean | null>(null);
  const mergingRef = useRef(false);

  useEffect(() => {
    if (isLoading) return;

    const prev = wasAuthedRef.current;
    wasAuthedRef.current = isAuthenticated;

    // Solo disparamos en la TRANSICIÓN false → true (login fresco). El
    // primer render con isAuthenticated=true (sesión persistida) NO
    // dispara merge, porque `prev === null`.
    if (prev !== false || !isAuthenticated) return;
    if (mergingRef.current) return;
    if (localItems.length === 0) return;

    mergingRef.current = true;
    void merge(localItems).finally(() => {
      mergingRef.current = false;
    });

    async function merge(items: typeof localItems) {
      const results = await Promise.allSettled(
        items.map((i) =>
          cartApi.addItem({ productId: i.productId, quantity: i.quantity }),
        ),
      );
      // Si al menos uno succeeded, limpiamos el local y refrescamos.
      const anySuccess = results.some((r) => r.status === 'fulfilled');
      if (anySuccess) {
        clearLocal();
        await qc.invalidateQueries({ queryKey: cartKeys.me() });
      }
    }
  }, [isAuthenticated, isLoading, localItems, clearLocal, qc]);
}
