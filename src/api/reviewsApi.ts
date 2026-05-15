import type {
  CreateReviewInput,
  Review,
  ReviewListResponse,
} from '@/types/reviews';
import { apiClient } from './client';

interface ListReviewsQuery {
  page?: number;
  limit?: number;
}

export const reviewsApi = {
  /** Lista pública de reviews aprobadas del producto (paginada). */
  listByProduct(
    productId: string,
    query: ListReviewsQuery = {},
  ): Promise<ReviewListResponse> {
    return apiClient.get<ReviewListResponse>(
      `/products/${productId}/reviews`,
      { query },
    );
  },
  /** Crea una review (JWT customer, requiere orden delivered con el producto). */
  create(productId: string, input: CreateReviewInput): Promise<Review> {
    return apiClient.post<Review>(`/products/${productId}/reviews`, input);
  },
};
