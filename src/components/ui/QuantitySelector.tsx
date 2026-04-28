import { Minus, Plus } from 'lucide-react';
import { cn } from '@/utils/cn';

interface Props {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max: number;
  disabled?: boolean;
  className?: string;
}

/**
 * +/- selector de cantidad con clamp. El valor se mantiene siempre dentro
 * del rango [min, max]. El botón menos se desactiva en el mínimo, el más
 * se desactiva en el máximo (o si `max <= 0`, e.g. agotado).
 */
export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max,
  disabled = false,
  className,
}: Props) {
  function clamp(n: number): number {
    return Math.max(min, Math.min(max, n));
  }

  const canDec = value > min && !disabled;
  const canInc = value < max && !disabled;

  return (
    <div
      className={cn(
        'inline-flex items-center border border-border rounded-sm overflow-hidden',
        disabled && 'opacity-50 cursor-not-allowed',
        className,
      )}
    >
      <button
        type="button"
        onClick={() => canDec && onChange(value - 1)}
        disabled={!canDec}
        aria-label="Disminuir cantidad"
        className="w-10 h-10 flex items-center justify-center text-foreground hover:bg-muted disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:text-muted-foreground transition-colors"
      >
        <Minus size={14} />
      </button>
      <input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(e) => {
          const parsed = Number.parseInt(e.target.value, 10);
          if (Number.isFinite(parsed)) onChange(clamp(parsed));
        }}
        disabled={disabled}
        aria-label="Cantidad"
        className="w-12 h-10 text-center bg-transparent text-sm tabular-nums border-x border-border focus:outline-none focus:bg-muted/40 disabled:cursor-not-allowed [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
      <button
        type="button"
        onClick={() => canInc && onChange(value + 1)}
        disabled={!canInc}
        aria-label="Aumentar cantidad"
        className="w-10 h-10 flex items-center justify-center text-foreground hover:bg-muted disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:text-muted-foreground transition-colors"
      >
        <Plus size={14} />
      </button>
    </div>
  );
}
