import { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/utils/cn';

interface Props {
  /** Valor seleccionado (1-5) o 0 si aún no se eligió. */
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  size?: number;
  className?: string;
}

const LABELS = ['Pésimo', 'Malo', 'Regular', 'Bueno', 'Excelente'];

/**
 * Selector interactivo de estrellas 1-5 con hover preview y click commit.
 * Soporta teclado (foco + flechas izq/der para navegar, enter/space para commit).
 */
export function StarsInput({
  value,
  onChange,
  disabled = false,
  size = 28,
  className,
}: Props) {
  const [hover, setHover] = useState<number>(0);
  const display = hover || value;

  function handleKeyDown(e: React.KeyboardEvent<HTMLButtonElement>, n: number) {
    if (disabled) return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      onChange(Math.min(5, n + 1));
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      onChange(Math.max(1, n - 1));
    }
  }

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <div
        role="radiogroup"
        aria-label="Calificación"
        className="inline-flex items-center gap-1"
        onMouseLeave={() => setHover(0)}
      >
        {[1, 2, 3, 4, 5].map((n) => {
          const filled = n <= display;
          const isChecked = n === value;
          return (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={isChecked}
              aria-label={`${n} ${n === 1 ? 'estrella' : 'estrellas'}`}
              disabled={disabled}
              tabIndex={isChecked || (value === 0 && n === 1) ? 0 : -1}
              onClick={() => onChange(n)}
              onMouseEnter={() => !disabled && setHover(n)}
              onKeyDown={(e) => handleKeyDown(e, n)}
              className={cn(
                'rounded-sm outline-none transition-transform',
                'focus-visible:ring-[3px] focus-visible:ring-ring/40',
                !disabled && 'hover:scale-110',
                disabled && 'opacity-50 cursor-not-allowed',
              )}
            >
              <Star
                size={size}
                className={cn(
                  filled
                    ? 'fill-amber-500 text-amber-500'
                    : 'text-muted-foreground/40',
                )}
              />
            </button>
          );
        })}
      </div>
      {display > 0 && (
        <span className="text-xs text-muted-foreground tabular-nums">
          {display} / 5 — {LABELS[display - 1]}
        </span>
      )}
    </div>
  );
}
