import type { ProductSortBy } from '@/types/product';

/**
 * Shape canónico de los search params de `/products`. Coincide 1-a-1 con
 * el `validateSearch` declarado en `routeTree.ts`.
 *
 * TanStack Router exige el objeto completo (no `Partial`) en `<Link search>`
 * y `navigate({ search })`, así que usamos este helper para no repetir los
 * campos en cada call site.
 */
export interface ProductsSearch {
  categoryId: string | undefined;
  search: string | undefined;
  sortBy: ProductSortBy | undefined;
  page: number | undefined;
}

export function buildProductsSearch(
  partial: Partial<ProductsSearch> = {},
): ProductsSearch {
  return {
    categoryId: partial.categoryId,
    search: partial.search,
    sortBy: partial.sortBy,
    page: partial.page,
  };
}
