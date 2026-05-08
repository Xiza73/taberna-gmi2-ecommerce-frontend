import { Banknote, Check, CreditCard, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import type { CustomerDocType, PaymentMethod } from '@/types/order';
import { cn } from '@/utils/cn';
import {
  CUSTOMER_DOC_TYPE_LABELS,
  ONLINE_PAYMENT_METHODS,
  PAYMENT_METHOD_DESCRIPTIONS,
  PAYMENT_METHOD_LABELS,
} from '../lib/labels';
import { useCheckoutStore } from '../store/checkoutStore';

const PAYMENT_ICONS: Record<PaymentMethod, typeof CreditCard> = {
  mercadopago: CreditCard,
  yape_plin: Smartphone,
  bank_transfer: Banknote,
  cash: Banknote,
};

const DOC_TYPES: CustomerDocType[] = ['dni', 'ruc'];

interface Props {
  onContinue: () => void;
  onBack: () => void;
}

function isValidDocNumber(type: CustomerDocType, number: string): boolean {
  const trimmed = number.trim();
  if (type === 'dni') return /^\d{8}$/.test(trimmed);
  return /^\d{11}$/.test(trimmed);
}

export function Step2Payment({ onContinue, onBack }: Props) {
  const paymentMethod = useCheckoutStore((s) => s.paymentMethod);
  const setPaymentMethod = useCheckoutStore((s) => s.setPaymentMethod);
  const invoiceEnabled = useCheckoutStore((s) => s.invoiceEnabled);
  const setInvoiceEnabled = useCheckoutStore((s) => s.setInvoiceEnabled);
  const docType = useCheckoutStore((s) => s.customerDocType);
  const setDocType = useCheckoutStore((s) => s.setCustomerDocType);
  const docNumber = useCheckoutStore((s) => s.customerDocNumber);
  const setDocNumber = useCheckoutStore((s) => s.setCustomerDocNumber);
  const notes = useCheckoutStore((s) => s.notes);
  const setNotes = useCheckoutStore((s) => s.setNotes);

  const docError =
    invoiceEnabled && docNumber.length > 0 && !isValidDocNumber(docType, docNumber)
      ? docType === 'dni'
        ? 'DNI debe tener 8 dígitos'
        : 'RUC debe tener 11 dígitos'
      : undefined;

  const canContinue =
    !invoiceEnabled || (docNumber.length > 0 && !docError);

  return (
    <section className="space-y-6">
      {/* Payment method cards */}
      <div>
        <h2
          className="text-lg mb-3"
          style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}
        >
          Método de pago
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {ONLINE_PAYMENT_METHODS.map((method) => {
            const Icon = PAYMENT_ICONS[method];
            const selected = paymentMethod === method;
            return (
              <button
                key={method}
                type="button"
                onClick={() => setPaymentMethod(method)}
                aria-pressed={selected}
                className={cn(
                  'text-left rounded-md border p-4 transition-colors',
                  selected
                    ? 'border-primary bg-primary/5'
                    : 'border-border bg-card hover:border-foreground/30',
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <Icon
                    size={18}
                    className={selected ? 'text-primary' : 'text-foreground/70'}
                  />
                  {selected && <Check size={14} className="text-primary" />}
                </div>
                <p className="text-sm" style={{ fontWeight: 500 }}>
                  {PAYMENT_METHOD_LABELS[method]}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
                  {PAYMENT_METHOD_DESCRIPTIONS[method]}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Boleta / factura toggle */}
      <div className="rounded-md border border-border bg-card p-4 space-y-3">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={invoiceEnabled}
            onChange={(e) => setInvoiceEnabled(e.target.checked)}
            className="mt-0.5 w-4 h-4 rounded border-border accent-primary cursor-pointer"
          />
          <div>
            <span className="text-sm" style={{ fontWeight: 500 }}>
              Necesito comprobante con datos
            </span>
            <p className="text-xs text-muted-foreground mt-0.5">
              Si no, te enviamos la confirmación a tu email sin DNI/RUC.
            </p>
          </div>
        </label>

        {invoiceEnabled && (
          <div className="space-y-3 pt-2 border-t border-border">
            <div className="flex gap-2">
              {DOC_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setDocType(type)}
                  aria-pressed={docType === type}
                  className={cn(
                    'flex-1 px-3 py-2 rounded-sm text-sm transition-colors',
                    docType === type
                      ? 'bg-foreground text-background'
                      : 'bg-muted text-foreground hover:bg-secondary',
                  )}
                >
                  {CUSTOMER_DOC_TYPE_LABELS[type]}
                </button>
              ))}
            </div>
            <Input
              label={docType === 'dni' ? 'Número de DNI' : 'Número de RUC'}
              type="text"
              inputMode="numeric"
              maxLength={docType === 'dni' ? 8 : 11}
              placeholder={docType === 'dni' ? '12345678' : '20123456789'}
              value={docNumber}
              onChange={(e) => setDocNumber(e.target.value.replace(/\D/g, ''))}
              error={docError}
              hint={
                !docError
                  ? docType === 'dni'
                    ? '8 dígitos'
                    : '11 dígitos'
                  : undefined
              }
            />
          </div>
        )}
      </div>

      {/* Notes */}
      <div className="rounded-md border border-border bg-card p-4 space-y-2">
        <label htmlFor="checkout-notes" className="block text-sm" style={{ fontWeight: 500 }}>
          Notas para el pedido (opcional)
        </label>
        <textarea
          id="checkout-notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          maxLength={500}
          placeholder="Indicaciones especiales, datos extra para entrega…"
          className="w-full rounded-sm border border-border bg-input-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring resize-none"
        />
        <p className="text-[10px] text-muted-foreground text-right">
          {notes.length}/500
        </p>
      </div>

      <div className="flex justify-between gap-3 pt-2">
        <Button type="button" variant="outline" size="lg" onClick={onBack}>
          Volver
        </Button>
        <Button
          type="button"
          size="lg"
          onClick={onContinue}
          disabled={!canContinue}
        >
          Revisar pedido
        </Button>
      </div>
    </section>
  );
}
