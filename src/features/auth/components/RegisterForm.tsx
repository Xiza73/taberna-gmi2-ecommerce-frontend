import { type FormEvent, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ApiError } from '@/api/errors';
import { useAuth } from '@/features/auth';

interface Props {
  onSuccess: () => void;
}

const MIN_PASSWORD_LENGTH = 8;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function RegisterForm({ onSuccess }: Props) {
  const { register, isRegistering } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);

    if (!name.trim() || !email || !password || !confirmPassword) {
      setFormError('Completá todos los campos requeridos.');
      return;
    }
    if (!EMAIL_RE.test(email)) {
      setFormError('Ingresá un email válido.');
      return;
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      setFormError(`La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`);
      return;
    }
    if (password !== confirmPassword) {
      setFormError('Las contraseñas no coinciden.');
      return;
    }

    try {
      await register({
        name: name.trim(),
        email,
        password,
        phone: phone.trim() || undefined,
      });
      onSuccess();
    } catch (err) {
      const msg =
        err instanceof ApiError
          ? err.status === 409
            ? 'Ya existe una cuenta con ese email.'
            : err.message
          : 'No se pudo crear la cuenta. Intentá de nuevo.';
      setFormError(msg);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <Input
        type="text"
        label="Nombre completo"
        placeholder="Ana Pérez"
        autoComplete="name"
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={isRegistering}
      />
      <Input
        type="email"
        label="Email"
        placeholder="tu@email.com"
        autoComplete="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={isRegistering}
      />
      <Input
        type="tel"
        label="Teléfono"
        placeholder="+51 999 999 999"
        autoComplete="tel"
        hint="Opcional"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        disabled={isRegistering}
      />
      <Input
        type="password"
        label="Contraseña"
        placeholder="••••••••"
        autoComplete="new-password"
        required
        hint={`Mínimo ${MIN_PASSWORD_LENGTH} caracteres`}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={isRegistering}
      />
      <Input
        type="password"
        label="Confirmar contraseña"
        placeholder="••••••••"
        autoComplete="new-password"
        required
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        disabled={isRegistering}
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
        loading={isRegistering}
        disabled={isRegistering}
      >
        {isRegistering ? 'Creando cuenta…' : 'Crear cuenta'}
      </Button>
    </form>
  );
}
