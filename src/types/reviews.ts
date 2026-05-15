/**
 * Review — espejo de la entidad `Review` del back. Mantenelo alineado
 * con `backend/docs/modules/reviews.md`.
 *
 * Solo se exponen al storefront reviews `isApproved === true`
 * (vía `GET /products/:productId/reviews`).
 */
export interface Review {
  id: string;
  productId: string;
  userId: string;
  /** Nombre público del autor (denormalizado por el back). */
  userName: string;
  /** Integer entre 1 y 5. */
  rating: number;
  comment: string | null;
  isApproved: boolean;
  createdAt: string;
}

export interface CreateReviewInput {
  /** Orden delivered del usuario que contiene el producto. */
  orderId: string;
  rating: number;
  comment?: string;
}

export interface ReviewListResponse {
  items: Review[];
  total: number;
  /** Promedio (1 decimal). Null si `total === 0`. */
  averageRating: number | null;
}
