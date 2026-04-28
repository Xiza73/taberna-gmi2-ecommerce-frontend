import { Outlet } from '@tanstack/react-router';
import { MainHeader } from '@/components/layout/MainHeader';
import { MainFooter } from '@/components/layout/MainFooter';

/**
 * Layout principal del storefront customer-facing. Header sticky + content +
 * footer. Se aplica a la home y a todas las páginas públicas/authed que
 * compartan navegación.
 *
 * NO se usa en `/login`, `/register`, `/forgot-password`, `/reset-password`
 * — esas páginas usan `PublicAuthLayout` (split-screen sin header).
 */
export function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <MainHeader />
      <div className="flex-1">
        <Outlet />
      </div>
      <MainFooter />
    </div>
  );
}
