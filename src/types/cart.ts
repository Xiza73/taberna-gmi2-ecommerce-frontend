/**
 * CartItem como llega del back. Espejo de `CartItemResponseDto`.
 *
 * El back guarda solo `productId, quantity` y enriquece la respuesta con
 * datos del producto al momento del query (productName, productSlug,
 * productImage, price). NO es snapshot — refleja el precio actual.
 *
 * `subtotal = price * quantity` (cents PEN).
 */
export interface CartItem {
  /** ID del CartItem (UUID generado por el back). */
  id: string;
  productId: string;
  productName: string;
  productSlug: string;
  productImage: string | null;
  /** Cents PEN. */
  price: number;
  quantity: number;
  /** price * quantity, también en cents. */
  subtotal: number;
}

export interface Cart {
  items: CartItem[];
  /** Sum de subtotales en cents PEN. */
  total: number;
}

/**
 * CartItem para el cart anónimo (localStorage). Tomamos un snapshot del
 * producto al agregar, igual que el back-shape. El `id` es el `productId`
 * (no hay un cartItem.id sintético en local — la key del item es el
 * propio productId).
 */
export interface AnonymousCartItem {
  productId: string;
  productName: string;
  productSlug: string;
  productImage: string | null;
  /** Cents PEN. */
  price: number;
  quantity: number;
  /** Stock conocido al momento de agregar — usado para clamp en cantidad. */
  maxStock: number;
}
