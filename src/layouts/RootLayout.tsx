import { useEffect } from 'react';
import { Outlet, useNavigate } from '@tanstack/react-router';
import { Toaster } from 'sonner';
import { onAuthExpired } from '@/api/tokens';
import { CartDrawer, useMergeAnonymousCartOnLogin } from '@/features/cart';

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
    <div className="min-h-screen bg-background text-foreground">
      <Outlet />
      <CartDrawer />
      <Toaster position="top-right" richColors closeButton />
    </div>
  );
}
