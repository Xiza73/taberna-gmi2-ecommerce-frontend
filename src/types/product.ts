/**
 * Product — espejo del `ProductResponseDto` del back. Mantenelo alineado
 * con `backend/docs/modules/products.md` cuando agreguen campos.
 *
 * Notas:
 * - `price` y `compareAtPrice` están en cents PEN (integers).
 * - `images` es un array de URLs (puede estar vacío).
 * - `averageRating` es decimal (1 decimal típicamente) o null si no tiene reviews.
 * - El back NO modela variants (colors/sizes) en el MVP — el Figma sí pero
 *   acá lo omitimos. Cuando lleguen al back, agregamos los campos.
 */
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  /** Cents PEN */
  price: number;
  /** Cents PEN, null si no hay precio anterior tachado */
  compareAtPrice: number | null;
  sku: string | null;
  stock: number;
  images: string[];
  categoryId: string;
  isActive: boolean;
  averageRating: number | null;
  totalReviews: number;
  createdAt: string;
  updatedAt: string;
}

export type ProductSortBy = 'newest' | 'price' | 'price_desc' | 'name' | 'rating';

export interface ProductsQuery {
  page?: number;
  limit?: number;
  categoryId?: string;
  search?: string;
  sortBy?: ProductSortBy;
}
