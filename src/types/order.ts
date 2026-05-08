/**
 * Order — espejo del `OrderResponseDto` del back. Mantenelo alineado
 * con `backend/docs/modules/orders.md`.
 */

export type OrderStatus =
  | 'pending'
  | 'paid'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export type PaymentMethod =
  | 'mercadopago'
  | 'cash'
  | 'yape_plin'
  | 'bank_transfer';

export type ShippingMethod = 'standard' | 'express' | 'pickup';

export type CustomerDocType = 'dni' | 'ruc';

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productSlug: string;
  productImage: string | null;
  /** Cents PEN. */
  unitPrice: number;
  quantity: number;
  /** unitPrice * quantity, en cents. */
  subtotal: number;
}

export interface OrderEvent {
  id: string;
  status: OrderStatus;
  description: string;
  performedBy: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

export interface ShippingAddressSnapshot {
  label: string;
  recipientName: string;
  phone: string;
  street: string;
  district: string;
  city: string;
  department: string;
  zipCode: string | null;
  reference: string | null;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  shippingMethod: ShippingMethod;
  /** Cents PEN. */
  subtotal: number;
  discount: number;
  shippingCost: number;
  total: number;
  couponId: string | null;
  couponCode: string | null;
  couponDiscount: number | null;
  shippingAddressSnapshot: ShippingAddressSnapshot;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  customerDocType: CustomerDocType | null;
  customerDocNumber: string | null;
  notes: string | null;
  adminNotes: string | null;
  createdAt: string;
  updatedAt: string;
  items?: OrderItem[];
  events?: OrderEvent[];
  /** Solo presente si paymentMethod === 'mercadopago' y la preferencia se creó OK. */
  paymentUrl?: string | null;
}

export interface CreateOrderInput {
  addressId: string;
  paymentMethod: PaymentMethod;
  shippingMethod: ShippingMethod;
  couponCode?: string;
  notes?: string;
  customerDocType?: CustomerDocType;
  /** 8 dígitos DNI o 11 dígitos RUC. Requerido si `customerDocType` está. */
  customerDocNumber?: string;
}
