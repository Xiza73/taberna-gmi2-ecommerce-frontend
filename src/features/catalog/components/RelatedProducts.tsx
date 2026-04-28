import { useMemo } from 'react';
import type { Category } from '@/types/category';
import { useProducts } from '../hooks/useProducts';
import { ProductCard } from './ProductCard';

interface Props {
  categoryId: string;
  /** Producto actual a excluir del listado. */
  excludeProductId: string;
  categoriesById: Map<string, Category>;
  /** Máximo de productos a mostrar (default 4). */
  limit?: number;
}

/**
 * Sección "También te puede interesar". Trae productos de la misma categoría
 * (excluyendo el actual). Si no hay productos suficientes o falla, no
 * renderiza nada.
 */
export function RelatedProducts({
  categoryId,
  excludeProductId,
  categoriesById,
  limit = 4,
}: Props) {
  // Pedimos uno extra por si el actual cae en el resultado.
  const { data, isLoading } = useProducts({
    categoryId,
    limit: limit + 1,
    sortBy: 'newest',
  });

  const related = useMemo(() => {
    if (!data) return [];
    return data.items
      .filter((p) => p.id !== excludeProductId)
      .slice(0, limit);
  }, [data, excludeProductId, limit]);

  if (!isLoading && related.length === 0) return null;

  return (
    <section className="mt-16 lg:mt-24">
      <header className="mb-6 lg:mb-8">
        <h2
          className="text-2xl lg:text-3xl"
          style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}
        >
          También te puede interesar
        </h2>
      </header>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
          {Array.from({ length: limit }).map((_, i) => (
            <div key={i} className="space-y-3 animate-pulse">
              <div className="aspect-[3/4] bg-muted rounded-sm" />
              <div className="h-2.5 w-16 bg-muted rounded" />
              <div className="h-4 w-full bg-muted rounded" />
              <div className="h-4 w-20 bg-muted rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
          {related.map((product, idx) => (
            <ProductCard
              key={product.id}
              product={product}
              categoriesById={categoriesById}
              index={idx}
            />
          ))}
        </div>
      )}
    </section>
  );
}
