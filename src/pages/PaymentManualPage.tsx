import { Link, useParams } from '@tanstack/react-router';
import { toast } from 'sonner';
import {
  AlertTriangle,
  Banknote,
  Check,
  Copy,
  Mail,
  MessageCircle,
  Smartphone,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useOrder } from '@/features/orders';
import { buildProductsSearch } from '@/features/catalog';
import type { PaymentMethod } from '@/types/order';
import { formatPEN } from '@/utils/format';

const YAPE_NUMBER = import.meta.env.VITE_YAPE_NUMBER ?? '999 999 999';
const BANK_NAME = import.meta.env.VITE_BANK_NAME ?? '';
const BANK_ACCOUNT = import.meta.env.VITE_BANK_ACCOUNT ?? '';
const BANK_CCI = import.meta.env.VITE_BANK_CCI ?? '';
const BANK_HOLDER = import.meta.env.VITE_BANK_HOLDER ?? '';
const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER ?? '';

/**
 * Página de instrucciones para pagos manuales (Yape/Plin/Transferencia)
 * y fallback cuando MercadoPago no pudo crear preferencia. Muestra los
 * datos del negocio + botón WhatsApp para enviar el comprobante.
 *
 * NO permite al customer marcar como pagado — eso es decisión del staff
 * desde el backoffice. Solo informa que la confirmación llegará por email.
 */
export function PaymentManualPage() {
  const { orderId } = useParams({
    from: '/mainLayout/payment/manual/$orderId',
  });
  const { data: order, isLoading, isError, error } = useOrder(orderId);

  if (isLoading) {
    return <Skeleton />;
  }

  if (isError || !order) {
    return (
      <main className="mx-auto max-w-2xl px-4 lg:px-8 py-16 lg:py-24">
        <div className="text-center space-y-4">
          <AlertTriangle size={32} className="mx-auto text-destructive" />
          <h1
            className="text-2xl"
            style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}
          >
            No encontramos tu pedido
          </h1>
          <p className="text-sm text-muted-foreground">
            {error instanceof Error ? error.message : 'Error desconocido'}
          </p>
          <Link to="/products" search={buildProductsSearch()}>
            <Button variant="outline" size="md" type="button">
              Volver al catálogo
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-4 lg:px-8 py-10 lg:py-14">
      <div className="text-center mb-8">
        <h1
          className="text-3xl mb-2"
          style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}
        >
          Pedido creado
        </h1>
        <p className="text-sm text-muted-foreground">
          Pedido{' '}
          <span className="text-foreground" style={{ fontWeight: 500 }}>
            {order.orderNumber}
          </span>{' '}
          — completá el pago para confirmarlo.
        </p>
      </div>

      <div className="bg-card border border-border rounded-md p-5 space-y-5">
        <PaymentInstructions
          method={order.paymentMethod}
          total={order.total}
          orderNumber={order.orderNumber}
        />

        <div className="border-t border-border pt-4 space-y-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Mail size={12} />
            <span>
              Te confirmaremos por email cuando recibamos el pago. Esto puede
              tomar hasta 24h hábiles.
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row gap-2 justify-center">
        <Link to="/products" search={buildProductsSearch()}>
          <Button variant="outline" size="md" type="button">
            Seguir comprando
          </Button>
        </Link>
      </div>
    </main>
  );
}

interface InstructionsProps {
  method: PaymentMethod;
  total: number;
  orderNumber: string;
}

function PaymentInstructions({ method, total, orderNumber }: InstructionsProps) {
  if (method === 'yape_plin') {
    return (
      <YapePlinInstructions total={total} orderNumber={orderNumber} />
    );
  }
  if (method === 'bank_transfer') {
    return (
      <BankTransferInstructions total={total} orderNumber={orderNumber} />
    );
  }
  // Fallback (cash o MP sin paymentUrl).
  return (
    <div className="space-y-3">
      <p className="text-sm">
        Total a pagar:{' '}
        <span
          className="tabular-nums"
          style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}
        >
          {formatPEN(total)}
        </span>
      </p>
      <p className="text-sm text-muted-foreground">
        Coordinaremos el pago contigo. Si no recibís novedades en pocas horas,
        contactanos por WhatsApp.
      </p>
      <WhatsAppButton orderNumber={orderNumber} total={total} />
    </div>
  );
}

function YapePlinInstructions({
  total,
  orderNumber,
}: {
  total: number;
  orderNumber: string;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Smartphone size={18} className="text-primary" />
        <h2 className="text-base" style={{ fontWeight: 500 }}>
          Pagá con Yape o Plin
        </h2>
      </div>

      <ul className="space-y-2 text-sm">
        <InstructionRow
          label="Número"
          value={YAPE_NUMBER}
          copyable
        />
        <InstructionRow
          label="Monto"
          value={formatPEN(total)}
          mono
        />
        <InstructionRow
          label="Asunto sugerido"
          value={orderNumber}
          copyable
        />
      </ul>

      <div className="rounded-sm bg-muted/50 px-3 py-2 text-xs text-muted-foreground leading-relaxed">
        Después de pagar, mandanos el comprobante por WhatsApp con el número
        de pedido.
      </div>

      <WhatsAppButton orderNumber={orderNumber} total={total} method="yape_plin" />
    </div>
  );
}

function BankTransferInstructions({
  total,
  orderNumber,
}: {
  total: number;
  orderNumber: string;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Banknote size={18} className="text-primary" />
        <h2 className="text-base" style={{ fontWeight: 500 }}>
          Transferencia bancaria
        </h2>
      </div>

      <ul className="space-y-2 text-sm">
        <InstructionRow label="Banco" value={BANK_NAME} />
        <InstructionRow label="Titular" value={BANK_HOLDER} />
        <InstructionRow label="Cuenta" value={BANK_ACCOUNT} copyable />
        <InstructionRow label="CCI (interbancarias)" value={BANK_CCI} copyable />
        <InstructionRow label="Monto" value={formatPEN(total)} mono />
        <InstructionRow label="Asunto sugerido" value={orderNumber} copyable />
      </ul>

      <div className="rounded-sm bg-muted/50 px-3 py-2 text-xs text-muted-foreground leading-relaxed">
        Transferencias entre el mismo banco son inmediatas; entre bancos
        distintos pueden tomar hasta 24h hábiles. Mandanos el comprobante por
        WhatsApp.
      </div>

      <WhatsAppButton orderNumber={orderNumber} total={total} method="bank_transfer" />
    </div>
  );
}

interface InstructionRowProps {
  label: string;
  value: string;
  copyable?: boolean;
  mono?: boolean;
}

function InstructionRow({ label, value, copyable, mono }: InstructionRowProps) {
  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      toast.success('Copiado al portapapeles');
    } catch {
      toast.error('No se pudo copiar');
    }
  }

  return (
    <li className="flex items-center justify-between gap-3 py-1.5 border-b border-border last:border-b-0">
      <span className="text-xs text-muted-foreground uppercase tracking-wider shrink-0">
        {label}
      </span>
      <span className="flex items-center gap-2 min-w-0">
        <span
          className={`text-sm text-foreground truncate ${mono ? 'tabular-nums' : ''}`}
          style={{ fontWeight: 500 }}
        >
          {value || '—'}
        </span>
        {copyable && value && (
          <button
            type="button"
            onClick={() => void copy()}
            aria-label={`Copiar ${label}`}
            className="p-1 -m-1 rounded text-muted-foreground hover:text-foreground transition-colors"
          >
            <Copy size={12} />
          </button>
        )}
      </span>
    </li>
  );
}

function WhatsAppButton({
  orderNumber,
  total,
  method,
}: {
  orderNumber: string;
  total: number;
  method?: PaymentMethod;
}) {
  if (!WHATSAPP_NUMBER) return null;

  const methodLabel =
    method === 'yape_plin'
      ? 'Yape/Plin'
      : method === 'bank_transfer'
        ? 'transferencia'
        : 'pago';
  const text = encodeURIComponent(
    `Hola, acabo de pagar mi pedido ${orderNumber} por ${methodLabel}. Adjunto el comprobante. Total: ${formatPEN(total)}.`,
  );
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;

  return (
    <a href={url} target="_blank" rel="noopener noreferrer">
      <Button type="button" size="lg" width="full">
        <MessageCircle size={16} />
        Enviar comprobante por WhatsApp
        <Check size={14} className="opacity-70" />
      </Button>
    </a>
  );
}

function Skeleton() {
  return (
    <main className="mx-auto max-w-2xl px-4 lg:px-8 py-10 lg:py-14">
      <div className="space-y-5 animate-pulse">
        <div className="h-8 w-1/2 mx-auto bg-muted rounded" />
        <div className="h-4 w-3/4 mx-auto bg-muted rounded" />
        <div className="h-64 bg-muted rounded-md" />
      </div>
    </main>
  );
}
