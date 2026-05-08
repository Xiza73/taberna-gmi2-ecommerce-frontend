import type { Paginated } from '@/types/api';
import type { CreateOrderInput, Order, OrderStatus } from '@/types/order';
import { apiClient } from './client';

interface ListOrdersQuery {
  page?: number;
  limit?: number;
  status?: OrderStatus;
}

export const ordersApi = {
  /** Crea orden desde el cart actual del customer + dirección + método. */
  create(input: CreateOrderInput): Promise<Order> {
    return apiClient.post<Order>('/orders', input);
  },
  /** Lista mis órdenes (paginado, filtro opcional por status). */
  list(query: ListOrdersQuery = {}): Promise<Paginated<Order>> {
    return apiClient.get<Paginated<Order>>('/orders', { query });
  },
  /** Detalle de una orden mía (incluye items + events). */
  getById(id: string): Promise<Order> {
    return apiClient.get<Order>(`/orders/${id}`);
  },
  /** Cancelar orden (solo si está pending) — restaura stock. */
  cancel(id: string): Promise<void> {
    return apiClient.post<void>(`/orders/${id}/cancel`);
  },
  /** Recrea preferencia MercadoPago si la orden no tiene `paymentUrl`. */
  retryPayment(id: string): Promise<{ paymentUrl: string }> {
    return apiClient.post<{ paymentUrl: string }>(`/orders/${id}/retry-payment`);
  },
  /** Verifica estado del pago manualmente (fallback del webhook). */
  verifyPayment(id: string): Promise<Order> {
    return apiClient.post<Order>(`/orders/${id}/verify-payment`);
  },
};
