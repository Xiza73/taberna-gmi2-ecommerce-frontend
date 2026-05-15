import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from '@tanstack/react-router';
import { toast } from 'sonner';
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Clock,
  CreditCard,
  ImageOff,
  MapPin,
  RefreshCw,
  XCircle,
} from 'lucide-react';
import {
  OrderStatusBadge,
  OrderTimeline,
  useCancelOrder,
  useOrder,
  useRetryPayment,
  useVerifyPayment,
} from '@/features/orders';
import {
  PAYMENT_METHOD_LABELS,
  SHIPPING_METHOD_LABELS,
} from '@/features/checkout';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { ApiError } from '@/api/errors';
import { useSeo } from '@/hooks/useSeo';
import type { Order } from '@/types/order';
import { formatDateTime, formatPEN } from '@/utils/format';

/**
 * Ventana de expiración para órdenes pending — espeja
 * `ORDER_EXPIRATION_HOURS` del back (default 2hs). Cuando el countdown
 * llega a 0, el cron del back va a expirar la orden y restaurar stock.
 */
const ORDER_EXPIRATION_HOURS = 2;

export function OrderDetailPage() {
  const { orderId } = useParams({
    from: '/mainLayout/accountLayout/account/orders/$orderId',
  });

  const { data: order, isLoading, isError, error, refetch } = useOrder(orderId);
  const cancelMutation = useCancelOrder();
  const retryMutation = useRetryPayment();
  const verifyMutation = useVerifyPayment();

  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const seo = useSeo({
    title: order
      ? `Pedido ${order.orderNumber} — Lumière`
      : 'Pedido — Lumière',
    noIndex: true,
  });

  async function handleCancel() {
    if (!order) return;
    try {
      await cancelMutation.mutateAsync(order.id);
      toast.success('Pedido cancelado');
      setShowCancelConfirm(false);
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : 'No se pudo cancelar el pedido',
      );
    }
  }

  async function handleRetryPayment() {
    if (!order) return;
    try {
      const result = await retryMutation.mutateAsync(order.id);
      // Redirect a MercadoPago — mismo patrón que el checkout original.
      window.location.assign(result.paymentUrl);
    } catch (err) {
      toast.error(
        err instanceof ApiError
          ? err.message
          : 'No se pudo regenerar el link de pago',
      );
    }
  }

  async function handleVerifyPayment() {
    if (!order) return;
    try {
      const updated = await verifyMutation.mutateAsync(order.id);
      if (updated.status === 'paid' || updated.status === 'processing') {
        toast.success('¡Pago confirmado!');
      } else {
        toast.info('Todavía no recibimos el pago. Intentá en unos minutos.');
      }
    } catch (err) {
      toast.error(
        err instanceof ApiError
          ? err.message
          : 'No se pudo verificar el pago',
      );
    }
  }

  if (isLoading) {
    return <DetailSkeleton />;
  }

  if (isError || !order) {
    return (
      <section className="space-y-4">
        {seo}
        <BackLink />
        <div className="rounded-md border border-destructive/30 bg-destructive/5 p-6 flex flex-col gap-3">
          <div className="flex items-start gap-3">
            <AlertTriangle size={20} className="text-destructive shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-destructive">
                No pudimos cargar el pedido.
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {error instanceof Error ? error.message : 'Error desconocido'}
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => void refetch()}
            className="self-start"
          >
            Reintentar
          </Button>
        </div>
      </section>
    );
  }

  const canCancel = order.status === 'pending';
  const canRetry = order.status === 'pending' && Boolean(order.paymentUrl);
  const canVerify = order.status === 'pending';

  return (
    <section className="space-y-6">
      {seo}
      <BackLink />

      <Header order={order} />

      {order.status === 'pending' && (
        <PendingBanner createdAt={order.createdAt} />
      )}

      {(canCancel || canRetry || canVerify) && (
        <div className="flex flex-wrap gap-2">
          {canRetry && (
            <Button
              type="button"
              variant="primary"
              size="md"
              loading={retryMutation.isPending}
              disabled={retryMutation.isPending}
              onClick={() => void handleRetryPayment()}
            >
              <CreditCard size={14} />
              Reintentar pago
            </Button>
          )}
          {canVerify && (
            <Button
              type="button"
              variant="outline"
              size="md"
              loading={verifyMutation.isPending}
              disabled={verifyMutation.isPending}
              onClick={() => void handleVerifyPayment()}
            >
              <RefreshCw size={14} />
              Verificar pago
            </Button>
          )}
          {canCancel && (
            <Button
              type="button"
              variant="ghost"
              size="md"
              onClick={() => setShowCancelConfirm(true)}
              disabled={cancelMutation.isPending}
              className="text-destructive hover:bg-destructive/5"
            >
              <XCircle size={14} />
              Cancelar pedido
            </Button>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        <div className="space-y-6 min-w-0">
          <ItemsList order={order} />

          {order.events && order.events.length > 0 && (
            <Section title="Historial">
              <OrderTimeline events={order.events} />
            </Section>
          )}
        </div>

        <aside className="space-y-6">
          <Totals order={order} />
          <ShippingInfo order={order} />
          <PaymentInfo order={order} />
        </aside>
      </div>

      <ConfirmDialog
        open={showCancelConfirm}
        onOpenChange={(open) => !open && setShowCancelConfirm(false)}
        title="¿Cancelar pedido?"
        message={`Vas a cancelar el pedido ${order.orderNumber}. Esta acción no se puede deshacer y se restaurará el stock de los productos.`}
        confirmLabel="Cancelar pedido"
        cancelLabel="Volver"
        variant="destructive"
        onConfirm={() => void handleCancel()}
        isPending={cancelMutation.isPending}
      />
    </section>
  );
}

function BackLink() {
  return (
    <Link
      to="/account/orders"
      search={{ status: undefined, page: undefined }}
      className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
    >
      <ArrowLeft size={14} />
      Volver a mis pedidos
    </Link>
  );
}

function Header({ order }: { order: Order }) {
  return (
    <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
      <div className="space-y-1">
        <div className="flex items-center gap-2 flex-wrap">
          <h2
            className="text-2xl"
            style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}
          >
            Pedido {order.orderNumber}
          </h2>
          <OrderStatusBadge status={order.status} size="md" />
        </div>
        <p className="text-xs text-muted-foreground">
          Realizado el {formatDateTime(order.createdAt)}
        </p>
      </div>
    </header>
  );
}

interface PendingBannerProps {
  createdAt: string;
}

function PendingBanner({ createdAt }: PendingBannerProps) {
  const expiresAt = useMemo(() => {
    const t = new Date(createdAt).getTime();
    return t + ORDER_EXPIRATION_HOURS * 60 * 60 * 1000;
  }, [createdAt]);

  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const remainingMs = Math.max(0, expiresAt - now);
  const expired = remainingMs === 0;

  if (expired) {
    return (
      <div className="rounded-md border border-destructive/30 bg-destructive/5 p-4 flex items-start gap-3">
        <AlertTriangle size={18} className="text-destructive shrink-0 mt-0.5" />
        <div className="text-sm space-y-0.5">
          <p style={{ fontWeight: 500 }} className="text-destructive">
            Este pedido ya expiró
          </p>
          <p className="text-xs text-muted-foreground">
            Si todavía querés los productos, podés crear un pedido nuevo desde
            el catálogo.
          </p>
        </div>
      </div>
    );
  }

  const totalSec = Math.floor(remainingMs / 1000);
  const hours = Math.floor(totalSec / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;
  const pad = (n: number) => n.toString().padStart(2, '0');

  return (
    <div className="rounded-md border border-amber-200 bg-amber-50 p-4 flex items-start gap-3">
      <Clock size={18} className="text-amber-700 shrink-0 mt-0.5" />
      <div className="text-sm space-y-0.5 flex-1">
        <p style={{ fontWeight: 500 }} className="text-amber-900">
          Tu pedido está esperando el pago
        </p>
        <p className="text-xs text-amber-800/80">
          Tenés{' '}
          <span className="tabular-nums" style={{ fontWeight: 600 }}>
            {pad(hours)}:{pad(minutes)}:{pad(seconds)}
          </span>{' '}
          para completarlo. Después se cancela automáticamente y se libera el
          stock.
        </p>
      </div>
    </div>
  );
}

function ItemsList({ order }: { order: Order }) {
  const items = order.items ?? [];
  if (items.length === 0) return null;

  return (
    <Section title="Productos">
      <ul className="space-y-3">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex gap-3 bg-card border border-border rounded-md p-3"
          >
            <Link
              to="/products/$slug"
              params={{ slug: item.productSlug }}
              className="shrink-0 w-16 h-20 bg-muted rounded-sm overflow-hidden"
            >
              {item.productImage ? (
                <img
                  src={item.productImage}
                  alt={item.productName}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  <ImageOff size={18} />
                </div>
              )}
            </Link>
            <div className="flex-1 min-w-0 flex flex-col justify-between">
              <div>
                <Link
                  to="/products/$slug"
                  params={{ slug: item.productSlug }}
                  className="text-sm leading-snug line-clamp-2 hover:text-primary transition-colors"
                  style={{ fontWeight: 500 }}
                >
                  {item.productName}
                </Link>
                <p className="text-xs text-muted-foreground mt-0.5 tabular-nums">
                  {formatPEN(item.unitPrice)} × {item.quantity}
                </p>
              </div>
            </div>
            <p
              className="text-sm tabular-nums shrink-0 self-start"
              style={{ fontWeight: 500 }}
            >
              {formatPEN(item.subtotal)}
            </p>
          </li>
        ))}
      </ul>
    </Section>
  );
}

function Totals({ order }: { order: Order }) {
  return (
    <Section title="Totales">
      <div className="bg-card border border-border rounded-md p-4 space-y-1.5 text-sm">
        <Row label="Subtotal" value={formatPEN(order.subtotal)} />
        {order.discount > 0 && (
          <Row
            label={
              order.couponCode ? `Descuento (${order.couponCode})` : 'Descuento'
            }
            value={`-${formatPEN(order.discount)}`}
            tone="success"
          />
        )}
        <Row
          label={SHIPPING_METHOD_LABELS[order.shippingMethod]}
          value={order.shippingCost === 0 ? 'Gratis' : formatPEN(order.shippingCost)}
        />
        <div className="border-t border-border pt-2 mt-2 flex items-baseline justify-between">
          <span className="text-sm">Total</span>
          <span
            className="text-lg tabular-nums"
            style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}
          >
            {formatPEN(order.total)}
          </span>
        </div>
      </div>
    </Section>
  );
}

function ShippingInfo({ order }: { order: Order }) {
  const addr = order.shippingAddressSnapshot;
  return (
    <Section title="Envío" icon={<MapPin size={14} />}>
      <div className="bg-card border border-border rounded-md p-4 text-sm space-y-1">
        <p style={{ fontWeight: 500 }}>{addr.recipientName}</p>
        <p className="text-muted-foreground">{addr.phone}</p>
        <p>{addr.street}</p>
        <p className="text-muted-foreground">
          {addr.district}, {addr.city}, {addr.department}
          {addr.zipCode ? ` · ${addr.zipCode}` : ''}
        </p>
        {addr.reference && (
          <p className="text-xs text-muted-foreground italic mt-1">
            {addr.reference}
          </p>
        )}
        <p className="text-xs text-muted-foreground pt-2 border-t border-border mt-2">
          Método:{' '}
          <span className="text-foreground">
            {SHIPPING_METHOD_LABELS[order.shippingMethod]}
          </span>
        </p>
      </div>
    </Section>
  );
}

function PaymentInfo({ order }: { order: Order }) {
  return (
    <Section title="Pago" icon={<CreditCard size={14} />}>
      <div className="bg-card border border-border rounded-md p-4 text-sm space-y-1.5">
        <p>
          <span className="text-muted-foreground">Método: </span>
          <span style={{ fontWeight: 500 }}>
            {PAYMENT_METHOD_LABELS[order.paymentMethod]}
          </span>
        </p>
        {order.status === 'paid' || order.status === 'processing' ||
        order.status === 'shipped' || order.status === 'delivered' ? (
          <p className="inline-flex items-center gap-1.5 text-xs text-emerald-700">
            <CheckCircle2 size={12} />
            Pago acreditado
          </p>
        ) : order.status === 'pending' ? (
          <p className="inline-flex items-center gap-1.5 text-xs text-amber-700">
            <Clock size={12} />
            Pendiente de pago
          </p>
        ) : null}
      </div>
    </Section>
  );
}

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-2">
      <h3 className="inline-flex items-center gap-1.5 text-xs tracking-wider uppercase text-muted-foreground">
        {icon}
        {title}
      </h3>
      {children}
    </section>
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

function DetailSkeleton() {
  return (
    <section className="space-y-5 animate-pulse">
      <div className="h-4 w-32 bg-muted rounded" />
      <div className="h-8 w-2/3 bg-muted rounded" />
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        <div className="space-y-3">
          <div className="h-24 bg-muted rounded-md" />
          <div className="h-24 bg-muted rounded-md" />
        </div>
        <div className="space-y-3">
          <div className="h-32 bg-muted rounded-md" />
          <div className="h-32 bg-muted rounded-md" />
        </div>
      </div>
    </section>
  );
}
