import {
  createRootRouteWithContext,
  createRoute,
  redirect,
} from '@tanstack/react-router';
import type { QueryClient } from '@tanstack/react-query';
import { RootLayout } from '@/layouts/RootLayout';
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

// --- Public routes (no auth required, no auth-aware redirect) ---
const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

// --- Public auth pages (login/register) — redirect to home if already authed ---
//
// El `beforeLoad` solo redirige si ya hay /me cacheado (sesión activa). No
// dispara una request — la primera visita sin sesión cae directo al form.
//
// `id: 'publicAuth'` es pathless layout (no agrega segmento al path). Las
// rutas hijas resuelven directamente como `/login` y `/register`. El parámetro
// `?redirect=` lo leemos manualmente desde `useLocation().searchStr` en
// LoginPage, para evitar fricción con los types del router cuando el path
// final tiene id como prefijo en algunas versiones.
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
  homeRoute,
  publicAuthLayoutRoute.addChildren([
    loginRoute,
    registerRoute,
    forgotPasswordRoute,
    resetPasswordRoute,
  ]),
]);
