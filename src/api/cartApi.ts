import type { Cart } from '@/types/cart';
import { apiClient } from './client';

interface AddItemInput {
  productId: string;
  quantity: number;
}

interface UpdateItemInput {
  quantity: number;
}

/**
 * Cliente HTTP del cart customer (`/cart` y `/cart/items/*`). Todos los
 * endpoints requieren JWT customer.
 *
 * Nota: las mutations del back devuelven `null` (no el cart actualizado),
 * así que después de llamarlas hay que invalidar el queryKey de
 * `cartKeys.me` para refrescar via TanStack Query.
 */
export const cartApi = {
  get(): Promise<Cart> {
    return apiClient.get<Cart>('/cart');
  },
  addItem(input: AddItemInput): Promise<void> {
    return apiClient.post<void>('/cart/items', input);
  },
  updateItem(itemId: string, input: UpdateItemInput): Promise<void> {
    return apiClient.patch<void>(`/cart/items/${itemId}`, input);
  },
  removeItem(itemId: string): Promise<void> {
    return apiClient.delete<void>(`/cart/items/${itemId}`);
  },
  clear(): Promise<void> {
    return apiClient.delete<void>('/cart');
  },
};
