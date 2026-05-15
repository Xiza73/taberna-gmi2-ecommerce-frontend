import { useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from '@tanstack/react-router';
import { ChevronDown, Package, ShoppingBag } from 'lucide-react';
import { Pagination } from '@/features/catalog';
import { OrderCard, useOrders } from '@/features/orders';
import { Button } from '@/components/ui/Button';
import { useSeo } from '@/hooks/useSeo';
import type { OrderStatus } from '@/types/order';

const VALID_STATUS: OrderStatus[] = [
  'pending',
  'paid',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
  'refunded',
];

interface OrdersSearch {
  status: OrderStatus | undefined;
  page: number | undefined;
}
const STATUS_LABEL: Record<OrderStatus, string> = {
  pending: 'Pendiente',
  paid: 'Pagada',
  processing: 'Preparando',
  shipped: 'Enviada',
  delivered: 'Entregada',
  cancelled: 'Cancelada',
  refunded: 'Reembolsada',
};

const DEFAULT_LIMIT = 10;

interface PageFilters {
  status: OrderStatus | null;
  page: number;
}

/**
 * Mismo parser manual que `ProductsListPage` — leemos `location.searchStr`
 * directo para evitar fricción con los types de `useSearch` cuando la
 * ruta vive dentro de un layout pathless.
 */
function parseFilters(searchStr: string): PageFilters {
  const params = new URLSearchParams(searchStr);
  const statusRaw = params.get('status');
  const status =
    statusRaw && (VALID_STATUS as string[]).includes(statusRaw)
      ? (statusRaw as OrderStatus)
      : null;
  const pageRaw = Number(params.get('page'));
  const page = Number.isFinite(pageRaw) && pageRaw > 0 ? Math.floor(pageRaw) : 1;
  return { status, page };
}

function filtersToSearch(filters: PageFilters): OrdersSearch {
  return {
    status: filters.status ?? undefined,
    page: filters.page > 1 ? filters.page : undefined,
  };
}

export function OrdersListPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const filters = useMemo(
    () => parseFilters(location.searchStr),
    [location.searchStr],
  );
  const seo = useSeo({ title: 'Mis pedidos — Lumière', noIndex: true });

  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
    isRefetching,
  } = useOrders({
    page: filters.page,
    limit: DEFAULT_LIMIT,
    status: filters.status ?? undefined,
  });

  const updateFilters = useCallback(
    (next: Partial<PageFilters>, options: { resetPage?: boolean } = {}) => {
      const merged: PageFilters = {
        ...filters,
        ...next,
        page: options.resetPage ? 1 : (next.page ?? filters.page),
      };
      void navigate({
        to: '/account/orders',
        search: filtersToSearch(merged),
      });
    },
    [filters, navigate],
  );

  const orders = data?.items ?? [];
  const hasFilter = filters.status !== null;

  return (
    <section className="space-y-5">
      {seo}
      <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h2 className="text-xl mb-1" style={{ fontWeight: 500 }}>
            Mis pedidos
          </h2>
          <p className="text-sm text-muted-foreground">
            Acá vas a ver el historial completo de tus compras.
          </p>
        </div>
        <StatusFilter
          value={filters.status}
          onChange={(status) => updateFilters({ status }, { resetPage: true })}
        />
      </header>

      {isError ? (
        <ErrorState
          message={error instanceof Error ? error.message : 'Error desconocido'}
          onRetry={() => void refetch()}
          isRetrying={isRefetching}
        />
      ) : isLoading ? (
        <ListSkeleton />
      ) : orders.length === 0 ? (
        <EmptyState hasFilter={hasFilter} />
      ) : (
        <>
          <div className="space-y-3">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>

          {data && data.totalPages > 1 && (
            <div className="pt-4">
              <Pagination
                page={filters.page}
                totalPages={data.totalPages}
                onChange={(page) => {
                  updateFilters({ page });
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                disabled={isFetching}
              />
            </div>
          )}
        </>
      )}
    </section>
  );
}

interface StatusFilterProps {
  value: OrderStatus | null;
  onChange: (next: OrderStatus | null) => void;
}

function StatusFilter({ value, onChange }: StatusFilterProps) {
  return (
    <label className="relative flex items-center gap-2 text-sm">
      <span className="text-muted-foreground hidden sm:inline">Estado</span>
      <span className="relative">
        <select
          value={value ?? ''}
          onChange={(e) => {
            const next = e.target.value as OrderStatus | '';
            onChange(next === '' ? null : next);
          }}
          className="appearance-none bg-input-background border border-border rounded-sm pl-3 pr-9 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 cursor-pointer"
          aria-label="Filtrar por estado"
        >
          <option value="">Todos</option>
          {VALID_STATUS.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABEL[s]}
            </option>
          ))}
        </select>
        <ChevronDown
          size={14}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
        />
      </span>
    </label>
  );
}

function EmptyState({ hasFilter }: { hasFilter: boolean }) {
  return (
    <div className="rounded-md border border-border bg-card/50 p-10 text-center space-y-3">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted">
        {hasFilter ? (
          <Package size={20} className="text-muted-foreground" />
        ) : (
          <ShoppingBag size={20} className="text-muted-foreground" />
        )}
      </div>
      <p className="text-base" style={{ fontWeight: 500 }}>
        {hasFilter ? 'No hay pedidos con ese estado' : 'Aún no realizaste compras'}
      </p>
      <p className="text-sm text-muted-foreground">
        {hasFilter
          ? 'Probá quitar el filtro para ver todos tus pedidos.'
          : 'Cuando hagas tu primera compra, vas a verla acá.'}
      </p>
    </div>
  );
}

function ErrorState({
  message,
  onRetry,
  isRetrying,
}: {
  message: string;
  onRetry: () => void;
  isRetrying: boolean;
}) {
  return (
    <div className="rounded-md border border-destructive/30 bg-destructive/5 p-6 flex flex-col gap-3">
      <div>
        <p className="text-sm text-destructive">No se pudieron cargar tus pedidos.</p>
        <p className="text-xs text-muted-foreground mt-1">{message}</p>
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onRetry}
        disabled={isRetrying}
        className="self-start"
      >
        {isRetrying ? 'Reintentando…' : 'Reintentar'}
      </Button>
    </div>
  );
}

function ListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="h-24 bg-card border border-border rounded-md animate-pulse"
        />
      ))}
    </div>
  );
}
