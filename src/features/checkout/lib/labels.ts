import type {
  CustomerDocType,
  OrderStatus,
  PaymentMethod,
  ShippingMethod,
} from '@/types/order';

export const SHIPPING_METHOD_LABELS: Record<ShippingMethod, string> = {
  standard: 'Envío estándar',
  express: 'Envío express',
  pickup: 'Recoger en tienda',
};

export const SHIPPING_METHOD_DESCRIPTIONS: Record<ShippingMethod, string> = {
  standard: 'Llegada en 3 a 5 días hábiles a tu dirección',
  express: 'Llegada en 24 a 48 horas a tu dirección',
  pickup: 'Retirá tu pedido en nuestra tienda sin costo',
};

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  mercadopago: 'MercadoPago',
  cash: 'Efectivo',
  yape_plin: 'Yape o Plin',
  bank_transfer: 'Transferencia bancaria',
};

export const PAYMENT_METHOD_DESCRIPTIONS: Record<PaymentMethod, string> = {
  mercadopago: 'Tarjeta de crédito, débito o saldo. Pago seguro y al instante.',
  cash: 'Solo disponible para compras en tienda física.',
  yape_plin: 'Pagá con Yape o Plin. Confirmamos tu pedido tras recibir el comprobante.',
  bank_transfer:
    'Transferí a nuestra cuenta bancaria y enviá el comprobante por WhatsApp.',
};

/** Métodos de pago habilitados en el checkout online (cash es solo POS). */
export const ONLINE_PAYMENT_METHODS: PaymentMethod[] = [
  'mercadopago',
  'yape_plin',
  'bank_transfer',
];

/** True si el pago se completa fuera de la app (Yape/transferencia). */
export function isManualPaymentMethod(method: PaymentMethod): boolean {
  return method === 'yape_plin' || method === 'bank_transfer' || method === 'cash';
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Pendiente de pago',
  paid: 'Pagado',
  processing: 'En preparación',
  shipped: 'Enviado',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
  refunded: 'Reembolsado',
};

export const CUSTOMER_DOC_TYPE_LABELS: Record<CustomerDocType, string> = {
  dni: 'DNI (Boleta)',
  ruc: 'RUC (Factura)',
};
