import { ChevronRight, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAddresses } from '@/features/addresses';
import type { CartItem } from '@/types/cart';
import {
  CUSTOMER_DOC_TYPE_LABELS,
  PAYMENT_METHOD_LABELS,
  SHIPPING_METHOD_LABELS,
} from '../lib/labels';
import { resolveShippingCost } from '../lib/shipping';
import { useCheckoutStore } from '../store/checkoutStore';

interface Props {
  items: CartItem[];
  onBack: () => void;
  onConfirm: () => void;
  isPlacingOrder: boolean;
}

export function Step3Review({ items, onBack, onConfirm, isPlacingOrder }: Props) {
  const shippingMethod = useCheckoutStore((s) => s.shippingMethod);
  const addressId = useCheckoutStore((s) => s.addressId);
  const paymentMethod = useCheckoutStore((s) => s.paymentMethod);
  const invoiceEnabled = useCheckoutStore((s) => s.invoiceEnabled);
  const docType = useCheckoutStore((s) => s.customerDocType);
  const docNumber = useCheckoutStore((s) => s.customerDocNumber);
  const notes = useCheckoutStore((s) => s.notes);

  const { data: addresses = [] } = useAddresses();
  const address = addresses.find((a) => a.id === addressId);
  const shippingCost = resolveShippingCost(shippingMethod);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <section className="space-y-6">
      <h2
        className="text-lg"
        style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}
      >
        Revisá tu pedido
      </h2>

      <div className="space-y-3">
        <ReviewBlock
          title={shippingMethod === 'pickup' ? 'Datos de contacto' : 'Dirección de envío'}
          subtitle={SHIPPING_METHOD_LABELS[shippingMethod]}
          subtitleSecondary={
            shippingCost === 0 ? 'Gratis' : undefined
          }
        >
          {address && (
            <div className="flex items-start gap-2 text-sm">
              <MapPin size={14} className="text-primary shrink-0 mt-0.5" />
              <div className="text-foreground/80">
                <p style={{ fontWeight: 500 }} className="text-foreground">
                  {address.recipientName}
                </p>
                <p>{address.phone}</p>
                <p>{address.street}</p>
                <p className="text-muted-foreground">
                  {address.district}, {address.city}, {address.department}
                </p>
              </div>
            </div>
          )}
        </ReviewBlock>

        <ReviewBlock
          title="Método de pago"
          subtitle={PAYMENT_METHOD_LABELS[paymentMethod]}
        >
          {invoiceEnabled && docNumber && (
            <p className="text-sm text-foreground/80">
              {CUSTOMER_DOC_TYPE_LABELS[docType]}:{' '}
              <span style={{ fontWeight: 500 }}>{docNumber}</span>
            </p>
          )}
        </ReviewBlock>

        <ReviewBlock title={`Productos (${itemCount})`}>
          <ul className="space-y-2 text-sm">
            {items.map((item) => (
              <li key={item.id} className="flex justify-between gap-2">
                <span className="text-foreground/80 truncate">
                  {item.quantity}× {item.productName}
                </span>
              </li>
            ))}
          </ul>
        </ReviewBlock>

        {notes.trim() && (
          <ReviewBlock title="Notas">
            <p className="text-sm text-foreground/80 whitespace-pre-line">
              {notes}
            </p>
          </ReviewBlock>
        )}
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed">
        Al confirmar el pedido aceptás los términos y condiciones de Lumière.
      </p>

      <div className="flex justify-between gap-3 pt-2">
        <Button type="button" variant="outline" size="lg" onClick={onBack} disabled={isPlacingOrder}>
          Volver
        </Button>
        <Button
          type="button"
          size="lg"
          onClick={onConfirm}
          loading={isPlacingOrder}
          disabled={isPlacingOrder}
        >
          {isPlacingOrder
            ? 'Creando pedido…'
            : paymentMethod === 'mercadopago'
              ? 'Pagar con MercadoPago'
              : 'Confirmar pedido'}
          {!isPlacingOrder && <ChevronRight size={16} />}
        </Button>
      </div>
    </section>
  );
}

interface ReviewBlockProps {
  title: string;
  subtitle?: string;
  subtitleSecondary?: string;
  children?: React.ReactNode;
}

function ReviewBlock({ title, subtitle, subtitleSecondary, children }: ReviewBlockProps) {
  return (
    <div className="rounded-md border border-border bg-card p-4 space-y-2">
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-xs uppercase tracking-wider text-muted-foreground">
          {title}
        </h3>
        {subtitle && (
          <p className="text-xs text-foreground" style={{ fontWeight: 500 }}>
            {subtitle}
            {subtitleSecondary && (
              <span className="text-muted-foreground ml-2">{subtitleSecondary}</span>
            )}
          </p>
        )}
      </div>
      {children}
    </div>
  );
}
