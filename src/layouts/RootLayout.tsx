import { useEffect } from 'react';
import { Outlet, useNavigate } from '@tanstack/react-router';
import { Toaster } from 'sonner';
import { onAuthExpired } from '@/api/tokens';

/**
 * Root layout placeholder. Va a evolucionar a un layout con header (logo +
 * nav + cart icon + user menu) y footer cuando empecemos a meter UI real
 * desde el Figma.
 *
 * Por ahora solo:
 * - Renderiza el Outlet
 * - Toaster global (sonner)
 * - Listener del evento `gmi2:ecommerce:auth-expired` que limpia y redirige
 */
export function RootLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    return onAuthExpired(() => {
      void navigate({ to: '/' });
    });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Outlet />
      <Toaster theme="dark" position="top-right" richColors closeButton />
    </div>
  );
}
