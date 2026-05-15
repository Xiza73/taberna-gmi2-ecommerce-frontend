import { type FormEvent, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ApiError } from '@/api/errors';
import { useChangePassword } from '../hooks/useAccountProfile';

interface FormState {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const INITIAL_STATE: FormState = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
};

const MIN_PASSWORD_LENGTH = 8;

/**
 * Formulario para cambiar la contraseña. Valida en cliente longitud mínima
 * y coincidencia de confirmación, luego delega al back que verifica la
 * password actual y persiste el hash nuevo.
 */
export function ChangePasswordForm() {
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [error, setError] = useState<string | null>(null);
  const changePassword = useChangePassword();

  const isPending = changePassword.isPending;

  function bind<K extends keyof FormState>(key: K) {
    return {
      value: form[key],
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm((s) => ({ ...s, [key]: e.target.value })),
      disabled: isPending,
    };
  }

  function validate(): string | null {
    if (!form.currentPassword) {
      return 'Ingresá tu contraseña actual.';
    }
    if (form.newPassword.length < MIN_PASSWORD_LENGTH) {
      return `La contraseña nueva debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`;
    }
    if (form.newPassword === form.currentPassword) {
      return 'La contraseña nueva debe ser distinta a la actual.';
    }
    if (form.newPassword !== form.confirmPassword) {
      return 'La confirmación no coincide con la contraseña nueva.';
    }
    return null;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      await changePassword.mutateAsync({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      toast.success('Contraseña actualizada');
      setForm(INITIAL_STATE);
    } catch (err) {
      const msg =
        err instanceof ApiError
          ? err.status === 401 || err.code === 'UNAUTHORIZED'
            ? 'La contraseña actual es incorrecta.'
            : err.message
          : 'No se pudo cambiar la contraseña. Intentá de nuevo.';
      setError(msg);
      toast.error(msg);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <Input
        type="password"
        label="Contraseña actual"
        autoComplete="current-password"
        required
        {...bind('currentPassword')}
      />
      <Input
        type="password"
        label="Contraseña nueva"
        autoComplete="new-password"
        required
        hint={`Mínimo ${MIN_PASSWORD_LENGTH} caracteres.`}
        {...bind('newPassword')}
      />
      <Input
        type="password"
        label="Confirmar contraseña nueva"
        autoComplete="new-password"
        required
        {...bind('confirmPassword')}
      />

      {error && (
        <div
          role="alert"
          className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive"
        >
          {error}
        </div>
      )}

      <div className="flex justify-end pt-1">
        <Button type="submit" size="md" loading={isPending} disabled={isPending}>
          {isPending ? 'Actualizando…' : 'Cambiar contraseña'}
        </Button>
      </div>
    </form>
  );
}
