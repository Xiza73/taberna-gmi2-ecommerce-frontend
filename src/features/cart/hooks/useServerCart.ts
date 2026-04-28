import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { cartApi } from '@/api/cartApi';

export const cartKeys = {
  all: ['cart'] as const,
  me: () => [...cartKeys.all, 'me'] as const,
};

interface UseServerCartOptions {
  enabled: boolean;
}

/**
 * Hook del cart server-side (autenticado). Solo se habilita cuando hay
 * sesión — cuando `enabled: false` la query no corre.
 */
export function useServerCart({ enabled }: UseServerCartOptions) {
  return useQuery({
    queryKey: cartKeys.me(),
    queryFn: cartApi.get,
    enabled,
    staleTime: 30_000,
  });
}

/**
 * Mutations del cart server. Cada una invalida `cartKeys.me` después de
 * resolver para que `useServerCart` refresque.
 */
export function useAddCartItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: cartApi.addItem,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: cartKeys.me() });
    },
  });
}

export function useUpdateCartItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      cartApi.updateItem(itemId, { quantity }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: cartKeys.me() });
    },
  });
}

export function useRemoveCartItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (itemId: string) => cartApi.removeItem(itemId),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: cartKeys.me() });
    },
  });
}

export function useClearCart() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: cartApi.clear,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: cartKeys.me() });
    },
  });
}
