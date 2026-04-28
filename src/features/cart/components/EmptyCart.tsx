import { Link } from '@tanstack/react-router';
import { ShoppingBag } from 'lucide-react';
import { buildProductsSearch } from '@/features/catalog';

interface Props {
  onClose: () => void;
}

export function EmptyCart({ onClose }: Props) {
  return (
    <div className="flex flex-col items-center justify-center text-center px-6 py-12">
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-muted mb-4">
        <ShoppingBag size={24} className="text-muted-foreground" />
      </div>
      <p className="text-base mb-1" style={{ fontWeight: 500 }}>
        Tu carrito está vacío
      </p>
      <p className="text-sm text-muted-foreground mb-6">
        Agregá productos para empezar tu compra.
      </p>
      <Link
        to="/products"
        search={buildProductsSearch()}
        onClick={onClose}
        className="text-sm text-primary hover:underline underline-offset-4"
      >
        Explorar catálogo
      </Link>
    </div>
  );
}
