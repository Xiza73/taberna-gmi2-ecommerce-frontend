import { Link } from '@tanstack/react-router';
import { ImageOff, Trash2 } from 'lucide-react';
import { QuantitySelector } from '@/components/ui/QuantitySelector';
import type { CartItem } from '@/types/cart';
import { formatPEN } from '@/utils/format';

interface Props {
  item: CartItem;
  /** Stock máximo conocido — limita el QuantitySelector. Si no se sabe, default 99. */
  maxStock?: number;
  onUpdateQuantity: (item: CartItem, quantity: number) => void;
  onRemove: (item: CartItem) => void;
  onNavigate?: () => void;
  isMutating?: boolean;
}

const DEFAULT_MAX = 99;

export function CartItemRow({
  item,
  maxStock,
  onUpdateQuantity,
  onRemove,
  onNavigate,
  isMutating = false,
}: Props) {
  return (
    <article className="flex gap-3 py-4 border-b border-border last:border-b-0">
      {/* Thumbnail */}
      <Link
        to="/products/$slug"
        params={{ slug: item.productSlug }}
        onClick={onNavigate}
        className="shrink-0 w-20 h-24 bg-muted rounded-sm overflow-hidden block"
      >
        {item.productImage ? (
          <img
            src={item.productImage}
            alt={item.productName}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <ImageOff size={20} />
          </div>
        )}
      </Link>

      {/* Body */}
      <div className="flex-1 min-w-0 flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <Link
            to="/products/$slug"
            params={{ slug: item.productSlug }}
            onClick={onNavigate}
            className="text-sm leading-snug text-foreground hover:text-primary transition-colors line-clamp-2"
          >
            {item.productName}
          </Link>
          <button
            type="button"
            onClick={() => onRemove(item)}
            aria-label="Quitar del carrito"
            disabled={isMutating}
            className="shrink-0 p-1 -m-1 text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 size={14} />
          </button>
        </div>

        <div className="flex items-end justify-between gap-2 mt-auto">
          <QuantitySelector
            value={item.quantity}
            onChange={(next) => onUpdateQuantity(item, next)}
            min={1}
            max={maxStock ?? DEFAULT_MAX}
            disabled={isMutating}
          />
          <div className="text-right">
            <p
              className="text-sm tabular-nums"
              style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}
            >
              {formatPEN(item.subtotal)}
            </p>
            {item.quantity > 1 && (
              <p className="text-[10px] text-muted-foreground tabular-nums">
                {formatPEN(item.price)} c/u
              </p>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
