import { useEffect, useState } from 'react';
import { Link, useLocation } from '@tanstack/react-router';
import { CheckCircle2, Loader2, Mail } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useVerifyPayment } from '@/features/orders';
import { buildProductsSearch } from '@/features/catalog';

/**
 * Llegada desde MercadoPago tras pago exitoso. MP devuelve query params
 * tipo `?collection_id=...&external_reference=<orderId>&...`.
 *
 * Disparamos `verify-payment` como fallback al webhook (idempotente). Si
 * falla, igual mostramos confirmación visual — el webhook eventualmente
 * va a actualizar.
 */
function parseExternalReference(searchStr: string): string | null {
  const params = new URLSearchParams(searchStr);
  return params.get('external_reference');
}

export function PaymentSuccessPage() {
  const location = useLocation();
  const [orderId] = useState(() => parseExternalReference(location.searchStr));
  const verify = useVerifyPayment();

  useEffect(() => {
    if (!orderId) return;
    verify.mutate(orderId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  return (
    <main className="mx-auto max-w-2xl px-4 lg:px-8 py-16 lg:py-24">
      <div className="text-center space-y-5">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-700">
          <CheckCircle2 size={32} />
        </div>
        <div>
          <h1
            className="text-3xl mb-2"
            style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}
          >
            ¡Pago recibido!
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Recibimos tu pago y estamos preparando tu pedido.
          </p>
        </div>

        {verify.isPending && (
          <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <Loader2 size={12} className="animate-spin" />
            Verificando estado…
          </p>
        )}

        <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <Mail size={12} />
          <span>Te enviamos un email con el detalle.</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
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
