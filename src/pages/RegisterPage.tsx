import { Link, useNavigate } from '@tanstack/react-router';
import { buildLoginSearch, GoogleSignInButton, RegisterForm } from '@/features/auth';
import { Divider } from '@/components/ui/Divider';

export function RegisterPage() {
  const navigate = useNavigate();

  function handleSuccess() {
    void navigate({ to: '/' });
  }

  return (
    <div>
      <header className="mb-8">
        <h2
          className="text-3xl mb-2"
          style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}
        >
          Creá tu cuenta
        </h2>
        <p className="text-sm text-muted-foreground">
          Sumate a Lumière para comprar más rápido y guardar tus favoritos.
        </p>
      </header>

      <RegisterForm onSuccess={handleSuccess} />

      <Divider label="o" className="my-5" />

      <GoogleSignInButton
        onSuccess={handleSuccess}
        loadingLabel="Verificando con Google…"
      />

      <p className="mt-6 text-sm text-muted-foreground text-center">
        ¿Ya tenés cuenta?{' '}
        <Link
          to="/login"
          search={buildLoginSearch()}
          className="text-primary hover:underline underline-offset-4"
        >
          Iniciá sesión
        </Link>
      </p>
    </div>
  );
}
