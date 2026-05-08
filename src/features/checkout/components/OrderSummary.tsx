import { ImageOff } from 'lucide-react';
import type { CartItem } from '@/types/cart';
import type { ShippingMethod } from '@/types/order';
import { formatPEN } from '@/utils/format';
import { SHIPPING_METHOD_LABELS } from '../lib/labels';

interface Props {
  items: CartItem[];
  subtotal: number;
  shippingMethod: ShippingMethod;
  /** Costos de envío resueltos del front (espejan los del back). */
  shippingCost: number;
  /** Descuento de cupón si aplica (cents). */
  discount?: number;
}

/**
 * Sidebar con resumen del cart + totales. Visible siempre durante el
 * checkout. Los `shippingCost` se calculan client-side (espejan los del
 * back: standard 1500, express 3000, pickup 0). El back recalcula al
 * crear la orden — esto es solo display.
 */
export function OrderSummary({
  items,
  subtotal,
  shippingMethod,
  shippingCost,
  discount = 0,
}: Props) {
  const total = subtotal - discount + shippingCost;

  return (
    <aside className="bg-card border border-border rounded-md p-4 lg:p-5 space-y-4 lg:sticky lg:top-24">
      <h3 className="text-sm tracking-wider uppercase text-muted-foreground">
        Resumen del pedido
      </h3>

      <ul className="space-y-3 max-h-72 overflow-y-auto pr-1">
        {items.map((item) => (
          <li key={item.id} className="flex gap-3">
            <div className="shrink-0 w-12 h-14 bg-muted rounded-sm overflow-hidden relative">
              {item.productImage ? (
                <img
                  src={item.productImage}
                  alt={item.productName}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  <ImageOff size={14} />
                </div>
              )}
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-foreground text-background text-[10px] flex items-center justify-center">
                {item.quantity}
              </span>
            </div>
            <div className="flex-1 min-w-0 flex justify-between gap-2">
              <p className="text-xs leading-snug line-clamp-2">{item.productName}</p>
              <p
                className="text-xs tabular-nums shrink-0"
                style={{ fontWeight: 500 }}
              >
                {formatPEN(item.subtotal)}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <div className="border-t border-border pt-3 space-y-1.5 text-sm">
        <Row label="Subtotal" value={formatPEN(subtotal)} />
        {discount > 0 && (
          <Row label="Descuento" value={`-${formatPEN(discount)}`} tone="success" />
        )}
        <Row
          label={SHIPPING_METHOD_LABELS[shippingMethod]}
          value={shippingCost === 0 ? 'Gratis' : formatPEN(shippingCost)}
        />
      </div>

      <div className="border-t border-border pt-3 flex items-baseline justify-between">
        <span className="text-sm">Total</span>
        <span
          className="text-xl tabular-nums"
          style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}
        >
          {formatPEN(total)}
        </span>
      </div>
    </aside>
  );
}

function Row({
  label,
  value,
  tone = 'default',
}: {
  label: string;
  value: string;
  tone?: 'default' | 'success';
}) {
  return (
    <div className="flex justify-between items-baseline">
      <span className="text-muted-foreground">{label}</span>
      <span
        className={`tabular-nums ${tone === 'success' ? 'text-emerald-700' : 'text-foreground'}`}
      >
        {value}
      </span>
    </div>
  );
}
