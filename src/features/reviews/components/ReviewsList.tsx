import { useState } from 'react';
import { ChevronLeft, ChevronRight, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ApiError } from '@/api/errors';
import { useProductReviews } from '../hooks/useReviews';
import { StarsDisplay } from './StarsDisplay';

interface Props {
  productId: string;
}

const PAGE_SIZE = 10;

export function ReviewsList({ productId }: Props) {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, error } = useProductReviews(productId, {
    page,
    limit: PAGE_SIZE,
  });

  return (
    <section
      aria-labelledby="reviews-heading"
      className="mt-12 lg:mt-16 pt-8 lg:pt-12 border-t border-border"
    >
      <h2
        id="reviews-heading"
        className="text-2xl lg:text-3xl mb-6"
        style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}
      >
        Reseñas
      </h2>

      {isLoading && <ReviewsSkeleton />}

      {isError && (
        <div
          role="alert"
          className="rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
        >
          {error instanceof ApiError
            ? error.message
            : 'No pudimos cargar las reseñas. Intentá de nuevo.'}
        </div>
      )}

      {data && data.total === 0 && <EmptyReviews />}

      {data && data.total > 0 && (
        <ReviewsContent
          items={data.items}
          total={data.total}
          averageRating={data.averageRating}
          page={page}
          onPageChange={setPage}
        />
      )}
    </section>
  );
}

interface ContentProps {
  items: import('@/types/reviews').Review[];
  total: number;
  averageRating: number | null;
  page: number;
  onPageChange: (page: number) => void;
}

function ReviewsContent({
  items,
  total,
  averageRating,
  page,
  onPageChange,
}: ContentProps) {
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="space-y-6">
      {averageRating !== null && (
        <div className="flex items-center gap-3 pb-4 border-b border-border">
          <StarsDisplay
            rating={Math.round(averageRating)}
            size={20}
            ariaLabel={`Promedio ${averageRating.toFixed(1)} de 5`}
          />
          <span
            className="text-2xl tabular-nums"
            style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}
          >
            {averageRating.toFixed(1)}
          </span>
          <span className="text-sm text-muted-foreground">
            ({total} {total === 1 ? 'reseña' : 'reseñas'})
          </span>
        </div>
      )}

      <ul className="space-y-5">
        {items.map((review) => (
          <ReviewItem key={review.id} review={review} />
        ))}
      </ul>

      {totalPages > 1 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}

function ReviewItem({
  review,
}: {
  review: import('@/types/reviews').Review;
}) {
  return (
    <li className="rounded-md border border-border bg-card px-4 py-4">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="min-w-0">
          <StarsDisplay
            rating={review.rating}
            size={14}
            ariaLabel={`${review.rating} de 5 estrellas`}
          />
          <p className="text-sm text-foreground mt-1.5" style={{ fontWeight: 500 }}>
            {review.userName}
          </p>
        </div>
        <time
          dateTime={review.createdAt}
          className="text-xs text-muted-foreground shrink-0"
        >
          {formatReviewDate(review.createdAt)}
        </time>
      </div>
      {review.comment && (
        <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line">
          {review.comment}
        </p>
      )}
    </li>
  );
}

function Pagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-2 pt-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page <= 1}
      >
        <ChevronLeft size={14} />
        Anterior
      </Button>
      <span className="text-xs text-muted-foreground tabular-nums">
        Página {page} de {totalPages}
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page >= totalPages}
      >
        Siguiente
        <ChevronRight size={14} />
      </Button>
    </div>
  );
}

function EmptyReviews() {
  return (
    <div className="rounded-md border border-dashed border-border px-6 py-10 text-center">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted text-muted-foreground mb-3">
        <MessageSquare size={20} />
      </div>
      <p className="text-sm text-muted-foreground">
        Aún no hay reseñas para este producto.
      </p>
    </div>
  );
}

function ReviewsSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-6 w-48 bg-muted rounded" />
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="rounded-md border border-border px-4 py-4 space-y-2"
        >
          <div className="h-4 w-28 bg-muted rounded" />
          <div className="h-3 w-32 bg-muted rounded" />
          <div className="h-3 w-full bg-muted rounded" />
          <div className="h-3 w-3/4 bg-muted rounded" />
        </div>
      ))}
    </div>
  );
}

function formatReviewDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat('es-PE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(d);
}
