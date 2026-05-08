import type { ShippingMethod } from '@/types/order';

/**
 * Costos de envío en cents PEN. Espejan los defaults del back
 * (`SHIPPING_STANDARD_COST=1500`, `SHIPPING_EXPRESS_COST=3000`,
 * `SHIPPING_PICKUP_COST=0`). El back recalcula al crear la orden — esto
 * es solo display.
 */
const SHIPPING_COSTS: Record<ShippingMethod, number> = {
  standard: 1500,
  express: 3000,
  pickup: 0,
};

export function resolveShippingCost(method: ShippingMethod): number {
  return SHIPPING_COSTS[method];
}
