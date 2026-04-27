import { type FormEvent, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ApiError } from '@/api/errors';
import { customerAuthApi } from '@/api/customerAuthApi';

interface Props {
  onSent: (email: string) => void;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ForgotPasswordForm({ onSent }: Props) {
  const [email, setEmail] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: customerAuthApi.forgotPassword,
  });

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);

    if (!email || !EMAIL_RE.test(email)) {
      setFormError('Ingresá un email válido.');
      return;
    }

    try {
      await mutation.mutateAsync({ email });
      onSent(email);
    } catch (err) {
      const msg =
        err instanceof ApiError
          ? err.code === 'RATE_LIMITED'
            ? 'Demasiados intentos. Esperá un minuto.'
            : err.message
          : 'No se pudo enviar el email. Intentá de nuevo.';
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
        disabled={mutation.isPending}
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
        loading={mutation.isPending}
        disabled={mutation.isPending}
      >
        {mutation.isPending ? 'Enviando…' : 'Enviar link de recuperación'}
      </Button>
    </form>
  );
}
