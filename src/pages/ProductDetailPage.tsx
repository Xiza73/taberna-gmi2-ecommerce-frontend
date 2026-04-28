import { useMemo, useState } from 'react';
import { Link, useParams } from '@tanstack/react-router';
import { toast } from 'sonner';
import {
  AlertTriangle,
  Heart,
  Package,
  RotateCcw,
  ShoppingCart,
  Truck,
} from 'lucide-react';
import {
  buildProductsSearch,
  ImageGallery,
  RelatedProducts,
  useCategories,
  useProduct,
} from '@/features/catalog';
import { useCart, useCartUiStore } from '@/features/cart';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Button } from '@/components/ui/Button';
import { QuantitySelector } from '@/components/ui/QuantitySelector';
import { StarRating } from '@/components/ui/StarRating';
import { ApiError } from '@/api/errors';
import { formatPEN } from '@/utils/format';

export function ProductDetailPage() {
  const { slug } = useParams({ from: '/mainLayout/products/$slug' });
  const { data: product, isLoading, isError, error } = useProduct(slug);
  const { data: categoriesData } = useCategories();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const { addItem } = useCart();
  const openCart = useCartUiStore((s) => s.openDrawer);

  const categoriesById = useMemo(() => {
    const m = new Map<string, NonNullable<typeof categoriesData>[number]>();
    if (!categoriesData) return m;
    for (const c of categoriesData) m.set(c.id, c);
    return m;
  }, [categoriesData]);

  if (isLoading) {
    return <DetailSkeleton />;
  }

  if (isError || !product) {
    const isNotFound = error instanceof ApiError && error.status === 404;
    return <NotFoundOrError isNotFound={isNotFound} message={error?.message} />;
  }

  const category = categoriesById.get(product.categoryId);
  const isOutOfStock = product.stock === 0;
  const discountPct = computeDiscount(product.price, product.compareAtPrice);

  async function handleAddToCart() {
    if (!product) return;
    setIsAdding(true);
    try {
      await addItem(product, quantity);
      toast.success(
        `${quantity > 1 ? `${quantity}x ` : ''}${product.name} agregado al carrito`,
      );
      openCart();
    } catch {
      // El hook ya muestra toast del error si fue server-side.
    } finally {
      setIsAdding(false);
    }
  }

  return (
    <main className="mx-auto max-w-[1400px] px-4 lg:px-8 py-6 lg:py-10">
      <Breadcrumb
        items={[
          { label: 'Inicio', to: '/' },
          {
            label: 'Productos',
            to: '/products',
            search: buildProductsSearch(),
          },
          ...(category
            ? [
                {
                  label: category.name,
                  to: '/products',
                  search: buildProductsSearch({ categoryId: category.id }),
                },
              ]
            : []),
          { label: product.name },
        ]}
      />

      <div className="mt-6 lg:mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
        {/* Gallery */}
        <ImageGallery images={product.images} alt={product.name} />

        {/* Info */}
        <div className="space-y-5">
          {category && (
            <p className="text-xs text-muted-foreground tracking-wider uppercase">
              {category.name}
            </p>
          )}

          <h1
            className="text-3xl lg:text-4xl leading-tight"
            style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}
          >
            {product.name}
          </h1>

          {product.averageRating !== null && (
            <StarRating
              rating={product.averageRating}
              totalReviews={product.totalReviews}
              size={16}
            />
          )}

          {/* Price */}
          <div className="flex items-baseline gap-3 flex-wrap">
            <span
              className="text-3xl text-foreground"
              style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}
            >
              {formatPEN(product.price)}
            </span>
            {product.compareAtPrice !== null &&
              product.compareAtPrice > product.price && (
                <>
                  <span className="text-base text-muted-foreground line-through">
                    {formatPEN(product.compareAtPrice)}
                  </span>
                  {discountPct !== null && (
                    <span className="px-2 py-0.5 text-xs tracking-wider rounded-sm bg-primary text-primary-foreground uppercase">
                      -{discountPct}%
                    </span>
                  )}
                </>
              )}
          </div>

          {/* Stock note */}
          <StockNote stock={product.stock} />

          {/* Description */}
          {product.description && (
            <div className="pt-2 border-t border-border">
              <h2
                className="text-sm tracking-wider uppercase text-muted-foreground mb-3"
                style={{ fontWeight: 500 }}
              >
                Descripción
              </h2>
              <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>
          )}

          {/* Quantity + add to cart */}
          <div className="pt-4 border-t border-border space-y-3">
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">Cantidad</span>
              <QuantitySelector
                value={quantity}
                onChange={setQuantity}
                min={1}
                max={Math.max(product.stock, 1)}
                disabled={isOutOfStock}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                size="lg"
                width="full"
                disabled={isOutOfStock}
                loading={isAdding}
                onClick={() => void handleAddToCart()}
                className="sm:flex-1"
              >
                <ShoppingCart size={16} />
                {isOutOfStock
                  ? 'Sin stock'
                  : isAdding
                    ? 'Agregando…'
                    : 'Agregar al carrito'}
              </Button>
              <Button
                variant="outline"
                size="lg"
                aria-label="Agregar a favoritos"
                disabled
                className="sm:w-auto"
              >
                <Heart size={16} />
                <span className="sm:hidden">Favoritos</span>
              </Button>
            </div>
          </div>

          {/* Trust strip */}
          <ul className="pt-4 border-t border-border grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-muted-foreground">
            <TrustItem icon={<Truck size={16} />} label="Envío gratis +S/.250" />
            <TrustItem icon={<RotateCcw size={16} />} label="30 días para cambios" />
            <TrustItem icon={<Package size={16} />} label="Empaque cuidadoso" />
          </ul>
        </div>
      </div>

      {/* Related */}
      <RelatedProducts
        categoryId={product.categoryId}
        excludeProductId={product.id}
        categoriesById={categoriesById}
      />
    </main>
  );
}

function computeDiscount(price: number, compareAtPrice: number | null): number | null {
  if (compareAtPrice === null || compareAtPrice <= price) return null;
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
}

function StockNote({ stock }: { stock: number }) {
  if (stock === 0) {
    return (
      <p className="text-sm text-destructive" style={{ fontWeight: 500 }}>
        Sin stock disponible
      </p>
    );
  }
  if (stock < 5) {
    return (
      <p className="text-sm text-amber-700" style={{ fontWeight: 500 }}>
        ¡Quedan solo {stock} unidades!
      </p>
    );
  }
  return <p className="text-sm text-muted-foreground">En stock</p>;
}

function TrustItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <li className="flex items-center gap-2">
      <span className="text-primary">{icon}</span>
      <span>{label}</span>
    </li>
  );
}

function DetailSkeleton() {
  return (
    <main className="mx-auto max-w-[1400px] px-4 lg:px-8 py-6 lg:py-10">
      <div className="h-3 w-64 bg-muted rounded animate-pulse mb-8" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
        <div className="aspect-[3/4] bg-muted rounded-sm animate-pulse" />
        <div className="space-y-5 animate-pulse">
          <div className="h-3 w-24 bg-muted rounded" />
          <div className="h-10 w-3/4 bg-muted rounded" />
          <div className="h-5 w-32 bg-muted rounded" />
          <div className="h-9 w-40 bg-muted rounded" />
          <div className="h-32 w-full bg-muted rounded" />
          <div className="h-12 w-full bg-muted rounded" />
        </div>
      </div>
    </main>
  );
}

function NotFoundOrError({
  isNotFound,
  message,
}: {
  isNotFound: boolean;
  message: string | undefined;
}) {
  return (
    <main className="mx-auto max-w-[1400px] px-4 lg:px-8 py-16 lg:py-24">
      <div className="max-w-md mx-auto text-center space-y-5">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-destructive/10">
          <AlertTriangle size={26} className="text-destructive" />
        </div>
        <div>
          <h1
            className="text-2xl mb-2"
            style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}
          >
            {isNotFound ? 'Producto no encontrado' : 'Error al cargar'}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isNotFound
              ? 'El producto que buscás no existe o ya no está disponible.'
              : (message ?? 'No pudimos cargar este producto. Intentá de nuevo.')}
          </p>
        </div>
        <Link
          to="/products"
          search={buildProductsSearch()}
          className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline underline-offset-4"
        >
          Volver al catálogo
        </Link>
      </div>
    </main>
  );
}
