import type { Product } from '@/types/product';
import type { Category } from '@/types/category';
import { ProductCard } from './ProductCard';

interface Props {
  products: Product[];
  categoriesById?: Map<string, Category>;
  isLoading?: boolean;
  /** Cantidad de skeletons cuando está loading. */
  skeletonCount?: number;
}

export function ProductGrid({
  products,
  categoriesById,
  isLoading = false,
  skeletonCount = 8,
}: Props) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="rounded-md border border-border bg-card/50 p-10 text-center">
        <p className="text-base text-foreground mb-1">Sin resultados</p>
        <p className="text-sm text-muted-foreground">
          No encontramos productos que coincidan con los filtros.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
      {products.map((product, idx) => (
        <ProductCard
          key={product.id}
          product={product}
          categoriesById={categoriesById}
          index={idx}
        />
      ))}
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="space-y-3 animate-pulse">
      <div className="aspect-[3/4] bg-muted rounded-sm" />
      <div className="h-2.5 w-16 bg-muted rounded" />
      <div className="h-4 w-full bg-muted rounded" />
      <div className="h-4 w-20 bg-muted rounded" />
    </div>
  );
}
