import { type FormEvent, useId, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { ApiError } from '@/api/errors';
import { useCreateReview } from '../hooks/useReviews';
import { StarsInput } from './StarsInput';

const MAX_COMMENT = 2000;

interface Props {
  productId: string;
  orderId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ReviewForm({ productId, orderId, onSuccess, onCancel }: Props) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState<string | null>(null);
  const commentId = useId();

  const mutation = useCreateReview(productId);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (rating < 1 || rating > 5) {
      setError('Elegí una calificación entre 1 y 5 estrellas.');
      return;
    }

    const trimmed = comment.trim();
    if (trimmed.length > MAX_COMMENT) {
      setError(`El comentario no puede superar ${MAX_COMMENT} caracteres.`);
      return;
    }

    try {
      await mutation.mutateAsync({
        orderId,
        rating,
        comment: trimmed ? trimmed : undefined,
      });
      toast.success('Reseña enviada, será publicada tras moderación');
      onSuccess?.();
    } catch (err) {
      const msg =
        err instanceof ApiError
          ? err.message
          : 'No pudimos enviar tu reseña. Intentá de nuevo.';
      setError(msg);
    }
  }

  const isPending = mutation.isPending;
  const remaining = MAX_COMMENT - comment.length;

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="space-y-1.5">
        <span className="block text-sm text-foreground">
          Calificación <span className="text-destructive">*</span>
        </span>
        <StarsInput
          value={rating}
          onChange={setRating}
          disabled={isPending}
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor={commentId} className="block text-sm text-foreground">
          Comentario
        </label>
        <textarea
          id={commentId}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          maxLength={MAX_COMMENT}
          rows={5}
          disabled={isPending}
          placeholder="Contanos qué te pareció el producto..."
          className="w-full rounded-md border border-border bg-input-background px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/30 disabled:opacity-50 resize-y"
        />
        <p className="text-xs text-muted-foreground text-right tabular-nums">
          {remaining} caracteres restantes
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive"
        >
          {error}
        </div>
      )}

      <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-2">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={onCancel}
            disabled={isPending}
          >
            Cancelar
          </Button>
        )}
        <Button
          type="submit"
          size="md"
          loading={isPending}
          disabled={isPending || rating < 1}
        >
          Enviar reseña
        </Button>
      </div>
    </form>
  );
}
