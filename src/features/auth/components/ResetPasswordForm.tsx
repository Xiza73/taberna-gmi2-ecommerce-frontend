import { type FormEvent, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ApiError } from '@/api/errors';
import { customerAuthApi } from '@/api/customerAuthApi';

interface Props {
  token: string;
  onSuccess: () => void;
}

const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 128;

export function ResetPasswordForm({ token, onSuccess }: Props) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: customerAuthApi.resetPassword,
  });

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);

    if (!newPassword || !confirmPassword) {
      setFormError('Completá ambos campos.');
      return;
    }
    if (newPassword.length < MIN_PASSWORD_LENGTH) {
      setFormError(`La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`);
      return;
    }
    if (newPassword.length > MAX_PASSWORD_LENGTH) {
      setFormError(`La contraseña no puede tener más de ${MAX_PASSWORD_LENGTH} caracteres.`);
      return;
    }
    if (newPassword !== confirmPassword) {
      setFormError('Las contraseñas no coinciden.');
      return;
    }

    try {
      await mutation.mutateAsync({ token, newPassword });
      onSuccess();
    } catch (err) {
      const msg =
        err instanceof ApiError
          ? err.status === 400
            ? 'El link es inválido o expiró. Pedí uno nuevo.'
            : err.code === 'RATE_LIMITED'
              ? 'Demasiados intentos. Esperá un minuto.'
              : err.message
          : 'No se pudo cambiar la contraseña. Intentá de nuevo.';
      setFormError(msg);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <Input
        type="password"
        label="Nueva contraseña"
        placeholder="••••••••"
        autoComplete="new-password"
        required
        hint={`Mínimo ${MIN_PASSWORD_LENGTH} caracteres`}
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        disabled={mutation.isPending}
      />
      <Input
        type="password"
        label="Confirmar contraseña"
        placeholder="••••••••"
        autoComplete="new-password"
        required
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
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
        {mutation.isPending ? 'Guardando…' : 'Cambiar contraseña'}
      </Button>
    </form>
  );
}
