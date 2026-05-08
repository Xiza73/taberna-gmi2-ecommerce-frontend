import { useState } from 'react';
import { Link, useLocation } from '@tanstack/react-router';
import { toast } from 'sonner';
import { AlertCircle, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useRetryPayment } from '@/features/orders';
import { ApiError } from '@/api/errors';
import { buildProductsSearch } from '@/features/catalog';

function parseExternalReference(searchStr: string): string | null {
  const params = new URLSearchParams(searchStr);
  return params.get('external_reference');
}

export function PaymentFailurePage() {
  const location = useLocation();
  const [orderId] = useState(() => parseExternalReference(location.searchStr));
  const retry = useRetryPayment();

  async function handleRetry() {
    if (!orderId) return;
    try {
      const { paymentUrl } = await retry.mutateAsync(orderId);
      window.location.assign(paymentUrl);
    } catch (err) {
      toast.error(
        err instanceof ApiError
          ? err.message
          : 'No se pudo reintentar el pago. Probá de nuevo en un momento.',
      );
    }
  }

  return (
    <main className="mx-auto max-w-2xl px-4 lg:px-8 py-16 lg:py-24">
      <div className="text-center space-y-5">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 text-destructive">
          <AlertCircle size={28} />
        </div>
        <div>
          <h1
            className="text-3xl mb-2"
            style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}
          >
            Pago no completado
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            MercadoPago no pudo procesar tu pago. Tu pedido está pendiente y
            podés reintentar.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
          {orderId && (
            <Button
              type="button"
              size="md"
              onClick={() => void handleRetry()}
              loading={retry.isPending}
              disabled={retry.isPending}
            >
              <RefreshCcw size={14} />
              Reintentar pago
            </Button>
          )}
          <Link to="/products" search={buildProductsSearch()}>
            <Button variant="outline" size="md" type="button">
              Seguir comprando
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
