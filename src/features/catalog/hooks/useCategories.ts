import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { categoriesApi } from '@/api/categoriesApi';
import type { Category } from '@/types/category';

export const categoriesKeys = {
  all: ['categories'] as const,
  list: () => [...categoriesKeys.all, 'list'] as const,
};

/**
 * Hook global de categorías. El back devuelve un FLAT array de categorías
 * activas; la UI suele querer las top-level (con `parentId === null`),
 * así que también exponemos `topLevel` ya filtrado y ordenado.
 *
 * Cacheamos por 5 minutos — las categorías cambian poco.
 */
export function useCategories() {
  const query = useQuery({
    queryKey: categoriesKeys.list(),
    queryFn: categoriesApi.list,
    staleTime: 5 * 60_000,
  });

  const topLevel = useMemo<Category[]>(() => {
    if (!query.data) return [];
    return [...query.data]
      .filter((c) => c.parentId === null && c.isActive)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }, [query.data]);

  return {
    ...query,
    /** Top-level categories (parentId === null), ordered by sortOrder asc. */
    topLevel,
  };
}
