import { toast } from 'sonner';
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetFooter,
  SheetHeader,
} from '@/components/ui/Sheet';
import { useAnonymousCartStore } from '../store/anonymousCartStore';
import { useCartUiStore } from '../store/cartUiStore';
import { useCart } from '../hooks/useCart';
import { CartItemRow } from './CartItemRow';
import { CartSummary } from './CartSummary';
import { EmptyCart } from './EmptyCart';

/**
 * Drawer global del cart. Se monta una sola vez en `RootLayout` y se
 * abre/cierra controlado por `useCartUiStore`.
 *
 * Para items autenticados, el `maxStock` no se conoce en el shape del
 * cart server (el back valida stock al mutate y devuelve 409 si excede).
 * Para items anónimos, sí lo tenemos snapshot en el store local.
 */
export function CartDrawer() {
  const isOpen = useCartUiStore((s) => s.isDrawerOpen);
  const setOpen = useCartUiStore((s) => s.setDrawerOpen);
  const closeDrawer = useCartUiStore((s) => s.closeDrawer);

  const { items, total, itemCount, isLoading, isAuthenticated, updateQuantity, removeItem } =
    useCart();
  const anonymousItems = useAnonymousCartStore((s) => s.items);

  const maxStockByProduct = new Map(
    anonymousItems.map((i) => [i.productId, i.maxStock]),
  );

  function handleCheckout() {
    // Checkout va en su propio PR. Por ahora solo aviso visual.
    toast.message('El checkout estará disponible próximamente.');
  }

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent title="Tu carrito">
        <SheetHeader
          title="Tu carrito"
          subtitle={
            itemCount > 0
              ? `${itemCount} ${itemCount === 1 ? 'producto' : 'productos'}`
              : isAuthenticated && isLoading
                ? 'Cargando…'
                : undefined
          }
        />

        <SheetBody>
          {isLoading && isAuthenticated ? (
            <CartSkeleton />
          ) : items.length === 0 ? (
            <EmptyCart onClose={closeDrawer} />
          ) : (
            <ul className="px-5">
              {items.map((item) => (
                <li key={item.id}>
                  <CartItemRow
                    item={item}
                    maxStock={maxStockByProduct.get(item.productId)}
                    onUpdateQuantity={(it, q) => void updateQuantity(it, q)}
                    onRemove={(it) => void removeItem(it)}
                    onNavigate={closeDrawer}
                  />
                </li>
              ))}
            </ul>
          )}
        </SheetBody>

        {items.length > 0 && (
          <SheetFooter>
            <CartSummary
              total={total}
              itemCount={itemCount}
              onCheckout={handleCheckout}
            />
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}

function CartSkeleton() {
  return (
    <div className="px-5 space-y-4 py-4">
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="flex gap-3 animate-pulse">
          <div className="w-20 h-24 bg-muted rounded-sm shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-3 bg-muted rounded w-3/4" />
            <div className="h-3 bg-muted rounded w-1/2" />
            <div className="h-8 bg-muted rounded w-32 mt-2" />
          </div>
        </div>
      ))}
    </div>
  );
}
