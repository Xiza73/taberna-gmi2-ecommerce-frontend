import { Link, useParams } from '@tanstack/react-router';
import { ArrowLeft, Construction } from 'lucide-react';
import { buildProductsSearch } from '@/features/catalog';

/**
 * Placeholder de la página de detalle. La implementación real (galería de
 * imágenes, descripción, reviews, agregar al carrito, productos relacionados)
 * entra en el PR siguiente del catálogo.
 */
export function ProductDetailPage() {
  const { slug } = useParams({ from: '/mainLayout/products/$slug' });

  return (
    <main className="mx-auto max-w-[1400px] px-4 lg:px-8 py-16 lg:py-24">
      <div className="max-w-md mx-auto text-center space-y-5">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-muted">
          <Construction size={24} className="text-muted-foreground" />
        </div>
        <div>
          <h1
            className="text-2xl mb-2"
            style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}
          >
            Detalle del producto
          </h1>
          <p className="text-sm text-muted-foreground">
            Slug: <code className="text-foreground">{slug}</code>
          </p>
          <p className="text-xs text-muted-foreground/70 mt-3">
            Esta página entra en el siguiente PR del catálogo.
          </p>
        </div>
        <Link
          to="/products"
          search={buildProductsSearch()}
          className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline underline-offset-4"
        >
          <ArrowLeft size={14} />
          Volver al catálogo
        </Link>
      </div>
    </main>
  );
}
