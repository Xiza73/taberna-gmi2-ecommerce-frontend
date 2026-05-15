import type { WishlistItem } from '@/types/wishlist';
import { apiClient } from './client';

export const wishlistApi = {
  /** Lista mi wishlist (auth JWT customer). Items con snapshot de producto. */
  list(): Promise<WishlistItem[]> {
    return apiClient.get<WishlistItem[]>('/wishlist');
  },
  /** Agrega un producto a mi wishlist. Idempotente: el back devuelve OK
   *  si ya estaba (unique constraint userId+productId). */
  add(productId: string): Promise<void> {
    return apiClient.post<void>(`/wishlist/${productId}`);
  },
  /** Quita un producto de mi wishlist. */
  remove(productId: string): Promise<void> {
    return apiClient.delete<void>(`/wishlist/${productId}`);
  },
};
