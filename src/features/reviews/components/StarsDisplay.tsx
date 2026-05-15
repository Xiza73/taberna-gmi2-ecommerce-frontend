import { Star } from 'lucide-react';
import { cn } from '@/utils/cn';

interface Props {
  /** Rating en escala 1-5 (entero). */
  rating: number;
  size?: number;
  className?: string;
  ariaLabel?: string;
}

/**
 * Display-only star rating para reviews ya enviadas (siempre enteros 1-5).
 * Para mostrar promedios decimales del producto usar `<StarRating>` en
 * `components/ui/StarRating.tsx`.
 */
export function StarsDisplay({
  rating,
  size = 16,
  className,
  ariaLabel,
}: Props) {
  const safe = Math.max(1, Math.min(5, Math.round(rating)));
  return (
    <div
      role="img"
      aria-label={ariaLabel ?? `${safe} de 5 estrellas`}
      className={cn('inline-flex items-center gap-0.5', className)}
    >
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < safe;
        return (
          <Star
            key={i}
            size={size}
            className={cn(
              filled
                ? 'fill-amber-500 text-amber-500'
                : 'text-muted-foreground/40',
            )}
            aria-hidden
          />
        );
      })}
    </div>
  );
}
