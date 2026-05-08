import { Link } from '@tanstack/react-router';
import { Clock, Mail } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { buildProductsSearch } from '@/features/catalog';

/**
 * MercadoPago dejó el pago en estado pendiente (típico con efectivo en
 * agente, transferencias, etc.). El webhook va a actualizar cuando
 * MercadoPago confirme.
 */
export function PaymentPendingPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 lg:px-8 py-16 lg:py-24">
      <div className="text-center space-y-5">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 text-amber-700">
          <Clock size={28} />
        </div>
        <div>
          <h1
            className="text-3xl mb-2"
            style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}
          >
            Pago pendiente
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Tu pago todavía no se acreditó. MercadoPago lo procesa y nos avisa
            por webhook.
          </p>
        </div>

        <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <Mail size={12} />
          <span>Te enviamos un email cuando se confirme.</span>
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
