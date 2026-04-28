import { Link, useLocation, useNavigate } from '@tanstack/react-router';
import { GoogleSignInButton, LoginForm } from '@/features/auth';
import { Divider } from '@/components/ui/Divider';

function parseRedirect(searchStr: string): string {
  const params = new URLSearchParams(searchStr);
  const value = params.get('redirect');
  // Solo aceptamos redirects relativos (mismo dominio) — evita open redirect.
  if (!value || !value.startsWith('/')) return '/';
  return value;
}

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = parseRedirect(location.searchStr);

  function handleSuccess() {
    // `redirectTo` es runtime-derived; usamos `href` (raw URL) en lugar de
    // `to` para no pelear con los types estrictos del router.
    void navigate({ href: redirectTo });
  }

  return (
    <div>
      <header className="mb-8">
        <h2
          className="text-3xl mb-2"
          style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}
        >
          Bienvenido
        </h2>
        <p className="text-sm text-muted-foreground">
          Iniciá sesión para acceder a tu cuenta y seguir comprando.
        </p>
      </header>

      <LoginForm onSuccess={handleSuccess} />

      <p className="mt-3 text-sm text-right">
        <Link
          to="/forgot-password"
          className="text-muted-foreground hover:text-primary hover:underline underline-offset-4"
        >
          ¿Olvidaste tu contraseña?
        </Link>
      </p>

      <Divider label="o" className="my-5" />

      <GoogleSignInButton
        onSuccess={handleSuccess}
        loadingLabel="Verificando con Google…"
      />

      <p className="mt-6 text-sm text-muted-foreground text-center">
        ¿Aún no tenés cuenta?{' '}
        <Link
          to="/register"
          className="text-primary hover:underline underline-offset-4"
        >
          Creá una
        </Link>
      </p>
    </div>
  );
}
