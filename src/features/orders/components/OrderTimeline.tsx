import {
  CheckCircle2,
  Circle,
  CircleX,
  Clock,
  Package,
  RefreshCw,
  Truck,
  type LucideIcon,
} from 'lucide-react';
import type { OrderEvent, OrderStatus } from '@/types/order';
import { formatDateTime } from '@/utils/format';
import { cn } from '@/utils/cn';

interface Props {
  events: OrderEvent[];
}

/**
 * Timeline vertical de eventos de la orden. Cada evento muestra:
 * icono (según `status`) + descripción + fecha. Los eventos vienen
 * cronológicamente desde el back; los pintamos sin re-ordenar.
 *
 * Si la lista está vacía, no renderiza nada — el caller decide qué hacer.
 */
export function OrderTimeline({ events }: Props) {
  if (events.length === 0) return null;

  return (
    <ol className="relative space-y-5">
      {events.map((event, idx) => {
        const Icon = ICON_BY_STATUS[event.status] ?? Circle;
        const isLast = idx === events.length - 1;
        return (
          <li key={event.id} className="relative pl-8">
            {/* Línea vertical conectando puntos */}
            {!isLast && (
              <span
                aria-hidden
                className="absolute left-[11px] top-6 bottom-[-1.25rem] w-px bg-border"
              />
            )}
            {/* Icono / punto */}
            <span
              className={cn(
                'absolute left-0 top-0 inline-flex items-center justify-center w-6 h-6 rounded-full border',
                idx === 0
                  ? 'bg-primary/10 border-primary/30 text-primary'
                  : 'bg-card border-border text-muted-foreground',
              )}
            >
              <Icon size={12} />
            </span>
            <div className="space-y-0.5">
              <p className="text-sm text-foreground" style={{ fontWeight: 500 }}>
                {event.description}
              </p>
              <p className="text-xs text-muted-foreground tabular-nums">
                {formatDateTime(event.createdAt)}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

const ICON_BY_STATUS: Record<OrderStatus, LucideIcon> = {
  pending: Clock,
  paid: CheckCircle2,
  processing: Package,
  shipped: Truck,
  delivered: CheckCircle2,
  cancelled: CircleX,
  refunded: RefreshCw,
};
