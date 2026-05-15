import { Link } from '@tanstack/react-router';
import { ChevronRight, Package } from 'lucide-react';
import type { Order } from '@/types/order';
import { formatDate } from '@/utils/format';
import { formatPEN } from '@/utils/format';
import { OrderStatusBadge } from './OrderStatusBadge';

interface Props {
  order: Order;
}

/**
 * Card compacta para el listado "Mis pedidos". Toda la card es link al
 * detalle (`/account/orders/$orderId`) — el chevron a la derecha
 * funciona como pista visual de affordance.
 *
 * La cantidad de items se calcula desde `items?.length`, pero en `/orders`
 * el back puede no enviar items en el list (solo en detail). Si falta, el
 * contador se oculta para no mentir.
 */
export function OrderCard({ order }: Props) {
  const itemsCount = order.items?.reduce((acc, it) => acc + it.quantity, 0);

  return (
    <Link
      to="/account/orders/$orderId"
      params={{ orderId: order.id }}
      className="group block bg-card border border-border rounded-md p-4 lg:p-5 hover:border-primary/30 hover:bg-card/80 transition-colors"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 text-sm" style={{ fontWeight: 500 }}>
              <Package size={14} className="text-primary" />
              {order.orderNumber}
            </span>
            <OrderStatusBadge status={order.status} />
          </div>
          <p className="text-xs text-muted-foreground">
            {formatDate(order.createdAt)}
            {typeof itemsCount === 'number' && itemsCount > 0 && (
              <>
                {' · '}
                {itemsCount} {itemsCount === 1 ? 'producto' : 'productos'}
              </>
            )}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span
            className="text-base tabular-nums"
            style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}
          >
            {formatPEN(order.total)}
          </span>
          <ChevronRight
            size={16}
            className="text-muted-foreground group-hover:text-primary transition-colors"
          />
        </div>
      </div>
    </Link>
  );
}
