import { useMemo } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/features/auth';
import type { CartItem } from '@/types/cart';
import type { Product } from '@/types/product';
import { useAnonymousCartStore } from '../store/anonymousCartStore';
import {
  useAddCartItem,
  useClearCart,
  useRemoveCartItem,
  useServerCart,
  useUpdateCartItem,
} from './useServerCart';

/**
 * Vista unificada del cart. Decide internamente si lee/escribe del store
 * anónimo (localStorage) o del back según `isAuthenticated`.
 *
 * Items siempre devuelven en el shape de `CartItem` (mismo del back) para
 * que los componentes de UI no se enteren de la diferencia. Para el modo
 * anónimo, el `id` es el `productId` (no hay cartItemId real hasta que
 * el cart se persista en la DB).
 */
interface UseCartReturn {
  items: CartItem[];
  total: number;
  itemCount: number;
  isLoading: boolean;
  isAuthenticated: boolean;
  addItem: (product: Product, quantity: number) => Promise<void>;
  updateQuantity: (item: CartItem, quantity: number) => Promise<void>;
  removeItem: (item: CartItem) => Promise<void>;
  clear: () => Promise<void>;
}

export function useCart(): UseCartReturn {
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  // Anonymous store
  const anonymousItems = useAnonymousCartStore((s) => s.items);
  const anonAdd = useAnonymousCartStore((s) => s.addItem);
  const anonUpdate = useAnonymousCartStore((s) => s.updateQuantity);
  const anonRemove = useAnonymousCartStore((s) => s.removeItem);
  const anonClear = useAnonymousCartStore((s) => s.clear);

  // Server cart (only when authed)
  const serverCartQuery = useServerCart({ enabled: isAuthenticated && !authLoading });
  const addServer = useAddCartItem();
  const updateServer = useUpdateCartItem();
  const removeServer = useRemoveCartItem();
  const clearServer = useClearCart();

  // Normalizamos anónimo al mismo shape de CartItem (id = productId).
  const anonAsCartItems: CartItem[] = useMemo(
    () =>
      anonymousItems.map((i) => ({
        id: i.productId,
        productId: i.productId,
        productName: i.productName,
        productSlug: i.productSlug,
        productImage: i.productImage,
        price: i.price,
        quantity: i.quantity,
        subtotal: i.price * i.quantity,
      })),
    [anonymousItems],
  );

  if (isAuthenticated) {
    const items = serverCartQuery.data?.items ?? [];
    return {
      items,
      total: serverCartQuery.data?.total ?? 0,
      itemCount: items.reduce((sum, i) => sum + i.quantity, 0),
      isLoading: serverCartQuery.isLoading,
      isAuthenticated: true,
      addItem: async (product, quantity) => {
        try {
          await addServer.mutateAsync({ productId: product.id, quantity });
        } catch (err) {
          toast.error(err instanceof Error ? err.message : 'No se pudo agregar');
          throw err;
        }
      },
      updateQuantity: async (item, quantity) => {
        try {
          await updateServer.mutateAsync({ itemId: item.id, quantity });
        } catch (err) {
          toast.error(err instanceof Error ? err.message : 'No se pudo actualizar');
          throw err;
        }
      },
      removeItem: async (item) => {
        try {
          await removeServer.mutateAsync(item.id);
        } catch (err) {
          toast.error(err instanceof Error ? err.message : 'No se pudo quitar');
          throw err;
        }
      },
      clear: async () => {
        try {
          await clearServer.mutateAsync();
        } catch (err) {
          toast.error(err instanceof Error ? err.message : 'No se pudo vaciar');
          throw err;
        }
      },
    };
  }

  return {
    items: anonAsCartItems,
    total: anonAsCartItems.reduce((sum, i) => sum + i.subtotal, 0),
    itemCount: anonAsCartItems.reduce((sum, i) => sum + i.quantity, 0),
    isLoading: false,
    isAuthenticated: false,
    addItem: async (product, quantity) => {
      anonAdd(product, quantity);
    },
    updateQuantity: async (item, quantity) => {
      anonUpdate(item.productId, quantity);
    },
    removeItem: async (item) => {
      anonRemove(item.productId);
    },
    clear: async () => {
      anonClear();
    },
  };
}
