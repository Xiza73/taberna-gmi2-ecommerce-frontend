import {
  createRootRouteWithContext,
  createRoute,
  redirect,
} from '@tanstack/react-router';
import type { QueryClient } from '@tanstack/react-query';
import { RootLayout } from '@/layouts/RootLayout';
import { MainLayout } from '@/layouts/MainLayout';
import { PublicAuthLayout } from '@/layouts/PublicAuthLayout';
import { AccountLayout } from '@/layouts/AccountLayout';
import { HomePage } from '@/pages/HomePage';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { ForgotPasswordPage } from '@/pages/ForgotPasswordPage';
import { ResetPasswordPage } from '@/pages/ResetPasswordPage';
import { ProductsListPage } from '@/pages/ProductsListPage';
import { ProductDetailPage } from '@/pages/ProductDetailPage';
import { AccountAddressesPage } from '@/pages/AccountAddressesPage';
import { authKeys } from '@/features/auth';
import { customerAuthApi } from '@/api/customerAuthApi';
import type { ProductSortBy } from '@/types/product';

const VALID_PRODUCT_SORT: ProductSortBy[] = [
  'newest',
  'price',
  'price_desc',
  'name',
  'rating',
];

interface RouterContext {
  queryClient: QueryClient;
}

const rootRoute = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
});

// --- Main shell (header + footer) for customer-facing pages ---
//
// Pathless layout: envuelve home y futuras rutas públicas / authed que
// compartan navegación (catálogo, productos, carrito, mi cuenta, etc.).
// NO incluye `/login`, `/register`, `/forgot-password`, `/reset-password`
// — esas usan `PublicAuthLayout` con split-screen sin header.
const mainLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'mainLayout',
  component: MainLayout,
});

const homeRoute = createRoute({
  getParentRoute: () => mainLayoutRoute,
  path: '/',
  component: HomePage,
});

const productsListRoute = createRoute({
  getParentRoute: () => mainLayoutRoute,
  path: '/products',
  component: ProductsListPage,
  validateSearch: (search: Record<string, unknown>) => {
    const sortByRaw = search.sortBy;
    const pageRaw = search.page;
    return {
      categoryId: typeof search.categoryId === 'string' ? search.categoryId : undefined,
      search: typeof search.search === 'string' ? search.search : undefined,
      sortBy:
        typeof sortByRaw === 'string' &&
        (VALID_PRODUCT_SORT as string[]).includes(sortByRaw)
          ? (sortByRaw as ProductSortBy)
          : undefined,
      page:
        typeof pageRaw === 'number' && pageRaw > 0
          ? Math.floor(pageRaw)
          : undefined,
    };
  },
});

const productDetailRoute = createRoute({
  getParentRoute: () => mainLayoutRoute,
  path: '/products/$slug',
  component: ProductDetailPage,
});

// --- Account section (/account/*) — auth required ---
//
// Pathless layout (id: 'accountLayout') que envuelve todas las rutas /account/*.
// Su `beforeLoad` exige sesión activa: si no hay /me cacheado, intenta
// cargarlo (puede disparar /me); si falla, redirige a /login con
// `?redirect=` apuntando al destino original para volver tras el login.
const accountLayoutRoute = createRoute({
  getParentRoute: () => mainLayoutRoute,
  id: 'accountLayout',
  component: AccountLayout,
  beforeLoad: async ({ context, location }) => {
    try {
      await context.queryClient.ensureQueryData({
        queryKey: authKeys.me,
        queryFn: customerAuthApi.me,
        staleTime: 30_000,
      });
    } catch {
      throw redirect({
        to: '/login',
        search: { redirect: location.href },
      });
    }
  },
});

// `/account` no tiene página propia — redirige a la primera sub-sección
// disponible (hoy: addresses).
const accountIndexRoute = createRoute({
  getParentRoute: () => accountLayoutRoute,
  path: '/account',
  beforeLoad: () => {
    throw redirect({ to: '/account/addresses' });
  },
});

const accountAddressesRoute = createRoute({
  getParentRoute: () => accountLayoutRoute,
  path: '/account/addresses',
  component: AccountAddressesPage,
});

// --- Public auth pages (login/register/forgot/reset) — redirect to home if already authed ---
//
// El `beforeLoad` solo redirige si ya hay /me cacheado (sesión activa). No
// dispara una request — la primera visita sin sesión cae directo al form.
const publicAuthLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'publicAuth',
  component: PublicAuthLayout,
  beforeLoad: ({ context }) => {
    const cached = context.queryClient.getQueryData(authKeys.me);
    if (cached) throw redirect({ to: '/' });
  },
});

const loginRoute = createRoute({
  getParentRoute: () => publicAuthLayoutRoute,
  path: '/login',
  component: LoginPage,
  // `?redirect=` se sigue parseando manualmente en `LoginPage` con
  // `useLocation().searchStr` (anti open-redirect + parser propio). El
  // `validateSearch` está acá solo para que `redirect({ to: '/login',
  // search: { redirect } })` desde otros guards typechequee.
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: typeof search.redirect === 'string' ? search.redirect : undefined,
  }),
});

const registerRoute = createRoute({
  getParentRoute: () => publicAuthLayoutRoute,
  path: '/register',
  component: RegisterPage,
});

const forgotPasswordRoute = createRoute({
  getParentRoute: () => publicAuthLayoutRoute,
  path: '/forgot-password',
  component: ForgotPasswordPage,
});

// `/reset-password?token=customerId.rawToken` — el token viene del email
// generado por el back. Lo leemos desde `useLocation().searchStr` en la page.
const resetPasswordRoute = createRoute({
  getParentRoute: () => publicAuthLayoutRoute,
  path: '/reset-password',
  component: ResetPasswordPage,
});

export const routeTree = rootRoute.addChildren([
  mainLayoutRoute.addChildren([
    homeRoute,
    productsListRoute,
    productDetailRoute,
    accountLayoutRoute.addChildren([accountIndexRoute, accountAddressesRoute]),
  ]),
  publicAuthLayoutRoute.addChildren([
    loginRoute,
    registerRoute,
    forgotPasswordRoute,
    resetPasswordRoute,
  ]),
]);
