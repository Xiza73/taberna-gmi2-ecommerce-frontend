import {
  createRootRouteWithContext,
  createRoute,
  redirect,
} from '@tanstack/react-router';
import type { QueryClient } from '@tanstack/react-query';
import { RootLayout } from '@/layouts/RootLayout';
import { MainLayout } from '@/layouts/MainLayout';
import { PublicAuthLayout } from '@/layouts/PublicAuthLayout';
import { HomePage } from '@/pages/HomePage';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { ForgotPasswordPage } from '@/pages/ForgotPasswordPage';
import { ResetPasswordPage } from '@/pages/ResetPasswordPage';
import { authKeys } from '@/features/auth';

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
  mainLayoutRoute.addChildren([homeRoute]),
  publicAuthLayoutRoute.addChildren([
    loginRoute,
    registerRoute,
    forgotPasswordRoute,
    resetPasswordRoute,
  ]),
]);
