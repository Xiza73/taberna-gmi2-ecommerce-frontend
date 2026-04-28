import { Link, Outlet, useRouterState } from '@tanstack/react-router';
import {
  Heart,
  LogOut,
  MapPin,
  Package,
  User,
  type LucideIcon,
} from 'lucide-react';
import { useAuth } from '@/features/auth';
import { cn } from '@/utils/cn';

/**
 * Layout interno de "/account/*" — sidebar lateral con la navegación
 * personal del customer + Outlet a la derecha. Vive dentro del MainLayout
 * (header/footer siguen visibles).
 *
 * Items disabled hoy: Perfil, Mis pedidos, Wishlist (vienen en sus PRs).
 */

interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  to?: string;
  disabled?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'orders', label: 'Mis pedidos', icon: Package, disabled: true },
  { id: 'addresses', label: 'Mis direcciones', icon: MapPin, to: '/account/addresses' },
  { id: 'wishlist', label: 'Wishlist', icon: Heart, disabled: true },
  { id: 'profile', label: 'Perfil', icon: User, disabled: true },
];

export function AccountLayout() {
  const { me, logout, isLoggingOut } = useAuth();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  return (
    <div className="mx-auto max-w-[1400px] px-4 lg:px-8 py-6 lg:py-10">
      <header className="mb-6 lg:mb-8">
        <h1
          className="text-2xl lg:text-3xl mb-1"
          style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}
        >
          Mi cuenta
        </h1>
        {me && (
          <p className="text-sm text-muted-foreground">
            Hola, <span className="text-foreground">{me.name}</span>
          </p>
        )}
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6 lg:gap-10">
        {/* Sidebar */}
        <aside>
          <nav className="bg-card border border-border rounded-md p-2">
            <ul className="space-y-0.5">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = item.to ? currentPath.startsWith(item.to) : false;
                return (
                  <li key={item.id}>
                    {item.to && !item.disabled ? (
                      <Link
                        to={item.to}
                        className={cn(
                          'flex items-center gap-2 px-3 py-2 rounded-sm text-sm transition-colors',
                          isActive
                            ? 'bg-primary/10 text-primary'
                            : 'text-foreground/80 hover:bg-muted',
                        )}
                      >
                        <Icon size={16} />
                        <span>{item.label}</span>
                      </Link>
                    ) : (
                      <span className="flex items-center gap-2 px-3 py-2 rounded-sm text-sm text-muted-foreground/60 cursor-not-allowed">
                        <Icon size={16} />
                        <span>{item.label}</span>
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
            <div className="border-t border-border mt-2 pt-2">
              <button
                type="button"
                onClick={() => void logout()}
                disabled={isLoggingOut}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-sm text-sm text-foreground/80 hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <LogOut size={16} />
                <span>{isLoggingOut ? 'Saliendo…' : 'Cerrar sesión'}</span>
              </button>
            </div>
          </nav>
        </aside>

        {/* Content */}
        <div className="min-w-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
