import { StrictMode, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { routeTree } from './router/routeTree';
import './styles/index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

const router = createRouter({
  routeTree,
  context: { queryClient },
  defaultPreload: 'intent',
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element #root not found');

/**
 * Si `VITE_GOOGLE_CLIENT_ID` no está configurado, no envolvemos con
 * `<GoogleOAuthProvider>` — el botón de Google chequea la env y se oculta
 * solo. Eso permite arrancar la app en envs que aún no tengan OAuth (CI,
 * primera setup local) sin romper.
 */
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function MaybeGoogleProvider({ children }: { children: ReactNode }) {
  if (!googleClientId) return <>{children}</>;
  return (
    <GoogleOAuthProvider clientId={googleClientId}>{children}</GoogleOAuthProvider>
  );
}

createRoot(rootElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <MaybeGoogleProvider>
        <RouterProvider router={router} />
      </MaybeGoogleProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>,
);
