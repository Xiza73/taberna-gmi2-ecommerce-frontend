import { type FormEvent, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ApiError } from '@/api/errors';
import { useAuth } from '@/features/auth';

interface Props {
  onSuccess: () => void;
}

export function LoginForm({ onSuccess }: Props) {
  const { login, isLoggingIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);

    if (!email || !password) {
      setFormError('Completá email y contraseña.');
      return;
    }

    try {
      await login({ email, password });
      onSuccess();
    } catch (err) {
      const msg =
        err instanceof ApiError
          ? err.status === 401
            ? 'Email o contraseña incorrectos.'
            : err.message
          : 'No se pudo iniciar sesión. Intentá de nuevo.';
      setFormError(msg);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <Input
        type="email"
        label="Email"
        placeholder="tu@email.com"
        autoComplete="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={isLoggingIn}
      />
      <Input
        type="password"
        label="Contraseña"
        placeholder="••••••••"
        autoComplete="current-password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={isLoggingIn}
      />

      {formError && (
        <div
          role="alert"
          className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive"
        >
          {formError}
        </div>
      )}

      <Button
        type="submit"
        size="lg"
        width="full"
        loading={isLoggingIn}
        disabled={isLoggingIn}
      >
        {isLoggingIn ? 'Ingresando…' : 'Iniciar sesión'}
      </Button>
    </form>
  );
}
