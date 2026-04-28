import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { productsApi } from '@/api/productsApi';
import type { ProductsQuery } from '@/types/product';

export const productsKeys = {
  all: ['products'] as const,
  list: (query: ProductsQuery) => [...productsKeys.all, 'list', query] as const,
  detail: (slug: string) => [...productsKeys.all, 'detail', slug] as const,
};

export function useProducts(query: ProductsQuery) {
  return useQuery({
    queryKey: productsKeys.list(query),
    queryFn: () => productsApi.list(query),
    placeholderData: keepPreviousData,
    staleTime: 60_000,
  });
}

/**
 * Devuelve el producto por slug. `enabled: false` mientras `slug` es
 * undefined (durante la primera render del param de la ruta).
 */
export function useProduct(slug: string | undefined) {
  return useQuery({
    queryKey: productsKeys.detail(slug ?? ''),
    queryFn: () => productsApi.bySlug(slug as string),
    enabled: Boolean(slug),
    staleTime: 60_000,
  });
}
