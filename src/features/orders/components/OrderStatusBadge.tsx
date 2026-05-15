import {
  CheckCircle2,
  Clock,
  CircleX,
  Package,
  RefreshCw,
  Truck,
  type LucideIcon,
} from 'lucide-react';
import type { OrderStatus } from '@/types/order';
import { cn } from '@/utils/cn';

interface Props {
  status: OrderStatus;
  /** `sm` para listados, `md` para detalle. Default `sm`. */
  size?: 'sm' | 'md';
  /** Si true, oculta el icono y queda como texto-pill. */
  hideIcon?: boolean;
  className?: string;
}

interface StatusConfig {
  label: string;
  icon: LucideIcon;
  /**
   * Tailwind classes con colores derivados de la paleta Lumière warm
   * (tierra/coral). No usamos `bg-primary` directo para no confundir con
   * CTAs — definimos tonos específicos por estado.
   */
  className: string;
}

const STATUS_CONFIG: Record<OrderStatus, StatusConfig> = {
  pending: {
    label: 'Pendiente',
    icon: Clock,
    className: 'bg-amber-100 text-amber-800 border-amber-200',
  },
  paid: {
    label: 'Pagada',
    icon: CheckCircle2,
    className: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  },
  processing: {
    label: 'Preparando',
    icon: Package,
    className: 'bg-primary/10 text-primary border-primary/20',
  },
  shipped: {
    label: 'Enviada',
    icon: Truck,
    className: 'bg-accent/15 text-accent-foreground border-accent/30',
  },
  delivered: {
    label: 'Entregada',
    icon: CheckCircle2,
    className: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  },
  cancelled: {
    label: 'Cancelada',
    icon: CircleX,
    className: 'bg-muted text-muted-foreground border-border',
  },
  refunded: {
    label: 'Reembolsada',
    icon: RefreshCw,
    className: 'bg-secondary text-secondary-foreground border-border',
  },
};

/**
 * Badge de estado de orden con icono + color. Paleta cálida Lumière para
 * los estados "in-house" (`processing`, `shipped`) y verdes/ámbares
 * estándar para los terminales (paid/delivered/pending) — buena
 * legibilidad en ambos temas.
 */
export function OrderStatusBadge({
  status,
  size = 'sm',
  hideIcon = false,
  className,
}: Props) {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;
  const sizeCls =
    size === 'md'
      ? 'px-3 py-1 text-xs gap-1.5'
      : 'px-2 py-0.5 text-[11px] gap-1';
  const iconSize = size === 'md' ? 14 : 12;

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-sm border tracking-wide font-medium',
        sizeCls,
        config.className,
        className,
      )}
    >
      {!hideIcon && <Icon size={iconSize} />}
      <span>{config.label}</span>
    </span>
  );
}
