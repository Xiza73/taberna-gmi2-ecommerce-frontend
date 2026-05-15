import { Link } from '@tanstack/react-router';
import { toast } from 'sonner';
import { Heart, ImageOff, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useSeo } from '@/hooks/useSeo';
import {
  useWishlist,
  useRemoveFromWishlist,
} from '@/features/wishlist';
import { buildProductsSearch } from '@/features/catalog';
import { ApiError } from '@/api/errors';
import { formatPEN } from '@/utils/format';
import type { WishlistItem } from '@/types/wishlist';

export function WishlistPage() {
  const seo = useSeo({ title: 'Mi wishlist — Lumière', noIndex: true });
  const { data, isLoading, isError, error, refetch, isRefetching } =
    useWishlist();
  const remove = useRemoveFromWishlist();

  async function handleRemove(item: WishlistItem) {
    try {
      await remove.mutateAsync(item.productId);
      toast.success('Producto eliminado de tu wishlist');
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : 'No se pudo eliminar',
      );
    }
  }

  return (
    <section className="space-y-5">
      {seo}
      <header>
        <h2 className="text-xl mb-1" style={{ fontWeight: 500 }}>
          Mi wishlist
        </h2>
        <p className="text-sm text-muted-foreground">
          Productos guardados para mirar después o comprar más tarde.
        </p>
      </header>

      {isError ? (
        <div className="rounded-md border border-destructive/30 bg-destructive/5 p-6 flex flex-col gap-3">
          <div>
            <p className="text-sm text-destructive">
              No se pudo cargar tu wishlist.
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {error instanceof Error ? error.message : 'Error desconocido'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isRefetching}
            className="self-start rounded-md border border-border bg-background px-3 py-1.5 text-xs hover:bg-muted transition-colors disabled:opacity-60"
          >
            {isRefetching ? 'Reintentando…' : 'Reintentar'}
          </button>
        </div>
      ) : isLoading ? (
        <GridSkeleton />
      ) : !data || data.length === 0 ? (
        <EmptyState />
      ) : (
        <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
          {data.map((item) => (
            <WishlistCard
              key={item.id}
              item={item}
              onRemove={() => void handleRemove(item)}
              isRemoving={
                remove.isPending && remove.variables === item.productId
              }
            />
          ))}
        </ul>
      )}
    </section>
  );
}

interface CardProps {
  item: WishlistItem;
  onRemove: () => void;
  isRemoving: boolean;
}

function WishlistCard({ item, onRemove, isRemoving }: CardProps) {
  const isOutOfStock = item.product.stock === 0;
  return (
    <li className="group">
      <Link
        to="/products/$slug"
        params={{ slug: item.product.slug }}
        className="block"
      >
        <div className="relative aspect-[3/4] bg-muted rounded-sm overflow-hidden mb-3">
          {item.product.image ? (
            <img
              src={item.product.image}
              alt={item.product.name}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <ImageOff size={28} />
            </div>
          )}
          {isOutOfStock && (
            <div className="absolute top-3 left-3">
              <span className="px-2.5 py-1 text-[10px] tracking-wider rounded-sm uppercase bg-foreground text-background">
                Agotado
              </span>
            </div>
          )}
        </div>
        <h3 className="text-sm leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-2">
          {item.product.name}
        </h3>
        <p
          className="text-base text-foreground mt-1"
          style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}
        >
          {formatPEN(item.product.price)}
        </p>
      </Link>
      <div className="mt-3">
        <Button
          variant="outline"
          size="sm"
          width="full"
          loading={isRemoving}
          onClick={onRemove}
          aria-label={`Quitar ${item.product.name} de wishlist`}
        >
          <Trash2 size={14} />
          Quitar
        </Button>
      </div>
    </li>
  );
}

function EmptyState() {
  return (
    <div className="rounded-md border border-border bg-card/50 p-10 text-center space-y-3">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted">
        <Heart size={20} className="text-muted-foreground" />
      </div>
      <p className="text-base" style={{ fontWeight: 500 }}>
        Tu wishlist está vacía
      </p>
      <p className="text-sm text-muted-foreground">
        Explorá el catálogo y guardá tus productos favoritos para después.
      </p>
      <div className="pt-2">
        <Link
          to="/products"
          search={buildProductsSearch()}
          className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground h-10 px-5 text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          Ir al catálogo
        </Link>
      </div>
    </div>
  );
}

function GridSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="space-y-3 animate-pulse">
          <div className="aspect-[3/4] bg-muted rounded-sm" />
          <div className="h-4 w-full bg-muted rounded" />
          <div className="h-4 w-20 bg-muted rounded" />
          <div className="h-8 w-full bg-muted rounded" />
        </div>
      ))}
    </div>
  );
}
