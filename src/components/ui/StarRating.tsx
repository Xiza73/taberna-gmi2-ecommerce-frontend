import { Star, StarHalf } from 'lucide-react';
import { cn } from '@/utils/cn';

interface Props {
  /** Rating en escala 0-5 (puede ser decimal). Null/undefined = sin rating. */
  rating: number | null | undefined;
  /** Si se provee, se muestra entre paréntesis al lado (e.g. "(12)"). */
  totalReviews?: number;
  size?: number;
  className?: string;
}

/**
 * Display-only star rating. Renderiza 5 estrellas: las llenas hasta el
 * piso de `rating`, una media si la fracción es ≥ 0.5, el resto vacías.
 */
export function StarRating({ rating, totalReviews, size = 14, className }: Props) {
  if (rating === null || rating === undefined) {
    return null;
  }

  const safe = Math.max(0, Math.min(5, rating));
  const full = Math.floor(safe);
  const hasHalf = safe - full >= 0.5;
  const empty = 5 - full - (hasHalf ? 1 : 0);

  return (
    <div className={cn('inline-flex items-center gap-1.5', className)}>
      <div className="inline-flex items-center text-amber-500">
        {Array.from({ length: full }).map((_, i) => (
          <Star key={`full-${i}`} size={size} className="fill-current" />
        ))}
        {hasHalf && <StarHalf key="half" size={size} className="fill-current" />}
        {Array.from({ length: empty }).map((_, i) => (
          <Star key={`empty-${i}`} size={size} className="text-muted-foreground/40" />
        ))}
      </div>
      <span className="text-xs text-muted-foreground tabular-nums">
        {safe.toFixed(1)}
        {totalReviews !== undefined && ` (${totalReviews})`}
      </span>
    </div>
  );
}
