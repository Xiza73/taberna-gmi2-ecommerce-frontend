import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { ordersApi } from '@/api/ordersApi';
import { cartKeys } from '@/features/cart';
import type { CreateOrderInput, OrderStatus } from '@/types/order';

export const ordersKeys = {
  all: ['orders'] as const,
  list: (filter: { page?: number; limit?: number; status?: OrderStatus }) =>
    [...ordersKeys.all, 'list', filter] as const,
  detail: (id: string) => [...ordersKeys.all, 'detail', id] as const,
};

interface UseOrderOptions {
  enabled?: boolean;
}

export function useOrder(id: string | undefined, options: UseOrderOptions = {}) {
  return useQuery({
    queryKey: ordersKeys.detail(id ?? ''),
    queryFn: () => ordersApi.getById(id as string),
    enabled: Boolean(id) && (options.enabled ?? true),
    staleTime: 15_000,
  });
}

interface UseOrdersOptions {
  page?: number;
  limit?: number;
  status?: OrderStatus;
  enabled?: boolean;
}

export function useOrders({
  page = 1,
  limit = 10,
  status,
  enabled = true,
}: UseOrdersOptions = {}) {
  return useQuery({
    queryKey: ordersKeys.list({ page, limit, status }),
    queryFn: () => ordersApi.list({ page, limit, status }),
    enabled,
    staleTime: 30_000,
    placeholderData: keepPreviousData,
  });
}

/**
 * Crea orden + el back vacía el cart server-side. Invalidamos `cartKeys.me`
 * para que el drawer/badge refresquen.
 */
export function useCreateOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateOrderInput) => ordersApi.create(input),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: cartKeys.me() });
      void qc.invalidateQueries({ queryKey: ordersKeys.all });
    },
  });
}

export function useCancelOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ordersApi.cancel(id),
    onSuccess: (_, id) => {
      void qc.invalidateQueries({ queryKey: ordersKeys.detail(id) });
      void qc.invalidateQueries({ queryKey: ordersKeys.all });
    },
  });
}

export function useRetryPayment() {
  return useMutation({
    mutationFn: (id: string) => ordersApi.retryPayment(id),
  });
}

export function useVerifyPayment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ordersApi.verifyPayment(id),
    onSuccess: (_, id) => {
      void qc.invalidateQueries({ queryKey: ordersKeys.detail(id) });
    },
  });
}
