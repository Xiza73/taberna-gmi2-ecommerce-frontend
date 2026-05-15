import { type MouseEvent } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Heart } from 'lucide-react';
import { useAuth, buildLoginSearch } from '@/features/auth';
import { useWishlistStore } from '../store/wishlistStore';
import { useAddToWishlist, useRemoveFromWishlist } from '../hooks/useWishlist';
import { cn } from '@/utils/cn';

interface Props {
  productId: string;
  /** Si la card linkea al detalle, este botón vive encima — necesita
   *  frenar la navegación cuando el customer hace click en el corazón. */
  stopPropagation?: boolean;
  /** Path al que volver tras loguear (default: `window.location` actual). */
  redirectAfterLogin?: string;
  className?: string;
}

/**
 * Botón corazón de wishlist. Lee el estado del `useWishlistStore` (rápido,
 * sin pegarle al server por cada card) y dispara las mutations optimistas.
 *
 * Si el customer no está logueado, redirige a `/login?redirect=…` para
 * que vuelva después al lugar del catálogo donde estaba.
 */
export function WishlistHeartButton({
  productId,
  stopPropagation = true,
  redirectAfterLogin,
  className,
}: Props) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const isInWishlist = useWishlistStore((s) => s.ids.has(productId));
  const add = useAddToWishlist();
  const remove = useRemoveFromWishlist();

  const isPending = add.isPending || remove.isPending;

  function handleClick(e: MouseEvent<HTMLButtonElement>) {
    if (stopPropagation) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (!isAuthenticated) {
      const fallback =
        typeof window !== 'undefined'
          ? `${window.location.pathname}${window.location.search}`
          : '/';
      void navigate({
        to: '/login',
        search: buildLoginSearch({ redirect: redirectAfterLogin ?? fallback }),
      });
      return;
    }

    if (isPending) return;

    if (isInWishlist) {
      remove.mutate(productId);
    } else {
      add.mutate(productId);
    }
  }

  const label = isInWishlist ? 'Quitar de wishlist' : 'Agregar a wishlist';

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      aria-label={label}
      aria-pressed={isInWishlist}
      title={label}
      className={cn(
        'inline-flex items-center justify-center w-9 h-9 rounded-full',
        'bg-background/90 backdrop-blur border border-border/70 shadow-sm',
        'transition-colors hover:bg-background',
        'focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40',
        'disabled:opacity-60 disabled:cursor-not-allowed',
        className,
      )}
    >
      <Heart
        size={16}
        className={cn(
          'transition-colors',
          isInWishlist
            ? 'fill-primary text-primary'
            : 'text-foreground/70',
        )}
      />
    </button>
  );
}
