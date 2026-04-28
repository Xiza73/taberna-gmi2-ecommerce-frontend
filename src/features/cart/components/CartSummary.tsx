import { Button } from '@/components/ui/Button';
import { formatPEN } from '@/utils/format';

interface Props {
  total: number;
  itemCount: number;
  onCheckout: () => void;
  /** Si el cart no está listo para checkout (vacío, mutating, etc.). */
  disabled?: boolean;
}

export function CartSummary({ total, itemCount, onCheckout, disabled }: Props) {
  return (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between">
        <span className="text-sm text-muted-foreground">
          Subtotal ({itemCount} {itemCount === 1 ? 'producto' : 'productos'})
        </span>
        <span
          className="text-lg tabular-nums"
          style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}
        >
          {formatPEN(total)}
        </span>
      </div>
      <p className="text-xs text-muted-foreground">
        Envío e impuestos calculados al finalizar la compra.
      </p>
      <Button
        size="lg"
        width="full"
        onClick={onCheckout}
        disabled={disabled}
      >
        Ir al checkout
      </Button>
    </div>
  );
}
