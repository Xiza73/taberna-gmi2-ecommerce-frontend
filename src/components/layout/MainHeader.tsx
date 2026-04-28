import { useEffect, useRef, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  Heart,
  LogOut,
  Menu,
  Package,
  Search,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  User,
  X,
} from 'lucide-react';
import { useAuth } from '@/features/auth';
import { cn } from '@/utils/cn';

/**
 * Header sticky principal del storefront. Brand a la izquierda, nav primaria
 * en el centro (desktop), action icons a la derecha (search, user, wishlist,
 * cart). En mobile colapsa a un menú dropdown.
 *
 * Por ahora los nav items y search/wishlist son placeholders (`disabled`):
 * se enganchan en los PRs de catálogo / search / wishlist.
 *
 * El badge del cart usa `cartItemCount` que por ahora viene siempre en 0;
 * se conectará cuando exista el feature de cart.
 */

const NAV_ITEMS = [
  { label: 'Novedades' },
  { label: 'Mujer' },
  { label: 'Hombre' },
  { label: 'Accesorios' },
  { label: 'Ofertas' },
] as const;

interface Props {
  cartItemCount?: number;
}

export function MainHeader({ cartItemCount = 0 }: Props) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-40 border-b border-border',
          'bg-background/80 backdrop-blur-xl',
        )}
      >
        <div className="mx-auto max-w-[1400px] px-4 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2 md:gap-3 group"
              aria-label="Lumière home"
            >
              <span className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary flex items-center justify-center transition-transform group-hover:scale-105">
                <Sparkles
                  size={16}
                  className="text-primary-foreground"
                />
              </span>
              <span
                className="text-xl md:text-2xl tracking-tight"
                style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}
              >
                Lumière
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-8">
              {NAV_ITEMS.map((item) => (
                <NavPlaceholder key={item.label}>{item.label}</NavPlaceholder>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-1 md:gap-2">
              <IconActionPlaceholder
                icon={<Search size={20} />}
                label="Buscar"
                className="hidden md:inline-flex"
              />
              <UserMenu />
              <IconActionPlaceholder
                icon={<Heart size={20} />}
                label="Favoritos"
                className="hidden md:inline-flex"
              />
              <IconActionPlaceholder
                icon={<ShoppingCart size={20} />}
                label="Carrito"
                badge={cartItemCount > 0 ? cartItemCount : undefined}
              />

              <button
                type="button"
                onClick={() => setIsMobileMenuOpen((v) => !v)}
                className="md:hidden p-2 rounded-full hover:bg-muted transition-colors"
                aria-label={isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
              >
                {isMobileMenuOpen ? (
                  <X size={20} className="text-foreground/70" />
                ) : (
                  <Menu size={20} className="text-foreground/70" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden fixed top-16 left-0 right-0 z-30 bg-background/95 backdrop-blur-xl border-b border-border overflow-hidden"
          >
            <div className="px-4 py-6 space-y-6">
              <nav className="flex flex-col gap-1">
                {NAV_ITEMS.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    disabled
                    className="text-left px-3 py-2.5 rounded-md text-base text-foreground/70 disabled:cursor-not-allowed"
                  >
                    {item.label}
                  </button>
                ))}
              </nav>

              <div className="border-t border-border pt-4">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    disabled
                    className="flex items-center justify-center gap-2 p-3 rounded-md text-foreground/60 disabled:cursor-not-allowed"
                  >
                    <Search size={18} />
                    <span className="text-sm">Buscar</span>
                  </button>
                  <button
                    type="button"
                    disabled
                    className="flex items-center justify-center gap-2 p-3 rounded-md text-foreground/60 disabled:cursor-not-allowed"
                  >
                    <Heart size={18} />
                    <span className="text-sm">Favoritos</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function NavPlaceholder({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="button"
      disabled
      className="text-sm tracking-wide text-foreground/70 hover:text-foreground transition-colors disabled:cursor-not-allowed"
    >
      {children}
    </button>
  );
}

interface IconActionPlaceholderProps {
  icon: React.ReactNode;
  label: string;
  badge?: number;
  className?: string;
}

function IconActionPlaceholder({
  icon,
  label,
  badge,
  className,
}: IconActionPlaceholderProps) {
  return (
    <button
      type="button"
      disabled
      aria-label={label}
      className={cn(
        'relative p-2 rounded-full text-foreground/70 hover:bg-muted transition-colors disabled:cursor-not-allowed',
        className,
      )}
    >
      {icon}
      {badge !== undefined && (
        <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center">
          {badge}
        </span>
      )}
    </button>
  );
}

/**
 * Dropdown del usuario:
 * - Si no hay sesión → ícono que linkea directo a `/login`.
 * - Si hay sesión → trigger con avatar/inicial; click abre menú con
 *   nombre del customer + links a "Mi cuenta", "Mis pedidos" y "Cerrar sesión".
 *
 * Sin Radix por ahora: dropdown casero con click-outside via `useEffect`.
 */
function UserMenu() {
  const { me, isAuthenticated, logout, isLoggingOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  if (!isAuthenticated) {
    return (
      <Link
        to="/login"
        aria-label="Iniciar sesión"
        className="p-2 rounded-full text-foreground/70 hover:bg-muted hover:text-foreground transition-colors"
      >
        <User size={20} />
      </Link>
    );
  }

  const initial = me?.name?.[0]?.toUpperCase() ?? 'U';

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        aria-label="Mi cuenta"
        aria-expanded={isOpen}
        className="w-9 h-9 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center hover:bg-secondary/80 transition-colors"
      >
        <span className="text-sm" style={{ fontWeight: 600 }}>
          {initial}
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            role="menu"
            className="absolute right-0 mt-2 w-60 bg-card border border-border rounded-md shadow-lg overflow-hidden"
          >
            <div className="px-4 py-3 border-b border-border">
              <p className="text-sm truncate" style={{ fontWeight: 500 }}>
                {me?.name ?? 'Mi cuenta'}
              </p>
              {me?.email && (
                <p className="text-xs text-muted-foreground truncate">{me.email}</p>
              )}
            </div>
            <div className="py-1">
              <UserMenuItem
                icon={<User size={16} />}
                label="Mi cuenta"
                disabled
                onClick={() => setIsOpen(false)}
              />
              <UserMenuItem
                icon={<Package size={16} />}
                label="Mis pedidos"
                disabled
                onClick={() => setIsOpen(false)}
              />
              <UserMenuItem
                icon={<ShoppingBag size={16} />}
                label="Wishlist"
                disabled
                onClick={() => setIsOpen(false)}
              />
            </div>
            <div className="border-t border-border py-1">
              <button
                type="button"
                onClick={async () => {
                  setIsOpen(false);
                  await logout();
                }}
                disabled={isLoggingOut}
                role="menuitem"
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-foreground/80 hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <LogOut size={16} />
                <span>{isLoggingOut ? 'Saliendo…' : 'Cerrar sesión'}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface UserMenuItemProps {
  icon: React.ReactNode;
  label: string;
  disabled?: boolean;
  onClick?: () => void;
}

function UserMenuItem({ icon, label, disabled, onClick }: UserMenuItemProps) {
  return (
    <button
      type="button"
      role="menuitem"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-2 px-4 py-2 text-sm text-foreground/80 hover:bg-muted transition-colors',
        disabled && 'opacity-60 cursor-not-allowed hover:bg-transparent',
      )}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
