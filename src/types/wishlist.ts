/**
 * Wishlist — espejo del `WishlistItemResponseDto` del back. Mantenelo
 * alineado con `backend/docs/modules/wishlist.md`.
 *
 * Cada item del listado trae un snapshot mínimo del producto (lo justo para
 * renderizar el grid y linkear al detalle).
 */

export interface WishlistProductSnapshot {
  name: string;
  slug: string;
  image: string | null;
  /** Cents PEN. */
  price: number;
  stock: number;
}

export interface WishlistItem {
  id: string;
  productId: string;
  product: WishlistProductSnapshot;
  addedAt: string;
}
