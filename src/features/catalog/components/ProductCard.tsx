import { Link } from '@tanstack/react-router';
import { motion } from 'motion/react';
import { ImageOff } from 'lucide-react';
import type { Product } from '@/types/product';
import type { Category } from '@/types/category';
import { formatPEN } from '@/utils/format';
import { cn } from '@/utils/cn';

interface Props {
  product: Product;
  /** Map id → Category, viene del padre que ya cargó categorías. */
  categoriesById?: Map<string, Category>;
  /** Index en el grid, para staggered entrance animation. */
  index?: number;
}

const LOW_STOCK_THRESHOLD = 5;

export function ProductCard({ product, categoriesById, index = 0 }: Props) {
  const image = product.images[0];
  const category = categoriesById?.get(product.categoryId);
  const discount = computeDiscount(product.price, product.compareAtPrice);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.04, 0.4), duration: 0.4 }}
      className="group"
    >
      <Link to="/products/$slug" params={{ slug: product.slug }} className="block">
        {/* Image */}
        <div className="relative aspect-[3/4] bg-muted rounded-sm overflow-hidden mb-3">
          {image ? (
            <img
              src={image}
              alt={product.name}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <ImageOff size={32} />
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
            {discount !== null && (
              <Badge tone="primary">-{discount}%</Badge>
            )}
            {product.stock > 0 && product.stock < LOW_STOCK_THRESHOLD && (
              <Badge tone="accent">¡Últimas unidades!</Badge>
            )}
            {product.stock === 0 && <Badge tone="muted">Agotado</Badge>}
          </div>
        </div>

        {/* Info */}
        <div className="space-y-1.5">
          {category && (
            <p className="text-[10px] text-muted-foreground tracking-wider uppercase">
              {category.name}
            </p>
          )}
          <h3 className="text-sm leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {product.name}
          </h3>
          <div className="flex items-baseline gap-2">
            <span
              className="text-base text-foreground"
              style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}
            >
              {formatPEN(product.price)}
            </span>
            {product.compareAtPrice !== null &&
              product.compareAtPrice > product.price && (
                <span className="text-xs text-muted-foreground line-through">
                  {formatPEN(product.compareAtPrice)}
                </span>
              )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function computeDiscount(price: number, compareAtPrice: number | null): number | null {
  if (compareAtPrice === null || compareAtPrice <= price) return null;
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
}

interface BadgeProps {
  tone: 'primary' | 'accent' | 'muted';
  children: React.ReactNode;
}

function Badge({ tone, children }: BadgeProps) {
  return (
    <span
      className={cn(
        'px-2.5 py-1 text-[10px] tracking-wider rounded-sm uppercase',
        tone === 'primary' && 'bg-primary text-primary-foreground',
        tone === 'accent' && 'bg-accent text-accent-foreground',
        tone === 'muted' && 'bg-foreground text-background',
      )}
    >
      {children}
    </span>
  );
}
