import { useEffect } from 'react';
import { Outlet, useNavigate } from '@tanstack/react-router';
import { Helmet } from 'react-helmet-async';
import { Toaster } from 'sonner';
import { onAuthExpired } from '@/api/tokens';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { CartDrawer, useMergeAnonymousCartOnLogin } from '@/features/cart';

const DEFAULT_TITLE = 'Lumière — Moda y lifestyle atemporal';
const DEFAULT_DESCRIPTION =
  'Lumière — piezas atemporales de moda y lifestyle. Calidad excepcional, diseño cuidado y envío a todo Perú.';

/**
 * Root layout. Renderiza el Outlet, la UI global (Toaster, CartDrawer)
 * y dispara hooks globales (auth-expired listener, anonymous-cart merge
 * on login).
 *
 * El CartDrawer vive acá (no dentro del MainLayout) para que también esté
 * disponible si en el futuro abrimos páginas que no usen MainLayout.
 */
export function RootLayout() {
  const navigate = useNavigate();
  useMergeAnonymousCartOnLogin();

  useEffect(() => {
    return onAuthExpired(() => {
      void navigate({ to: '/' });
    });
  }, [navigate]);

  return (
    <>
      <Helmet defaultTitle={DEFAULT_TITLE} titleTemplate="%s">
        <html lang="es" />
        <title>{DEFAULT_TITLE}</title>
        <meta name="description" content={DEFAULT_DESCRIPTION} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={DEFAULT_TITLE} />
        <meta property="og:description" content={DEFAULT_DESCRIPTION} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={DEFAULT_TITLE} />
        <meta name="twitter:description" content={DEFAULT_DESCRIPTION} />
      </Helmet>
      <div className="min-h-screen bg-background text-foreground">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
        <CartDrawer />
        <Toaster position="top-right" richColors closeButton />
      </div>
    </>
  );
}
