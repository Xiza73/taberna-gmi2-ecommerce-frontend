import { type FormEvent, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ApiError } from '@/api/errors';
import { useAuth } from '@/features/auth';
import type { UpdateProfileInput } from '@/types/auth';
import { useUpdateProfile } from '../hooks/useAccountProfile';

interface FormState {
  name: string;
  phone: string;
}

/**
 * Formulario para editar el perfil del customer.
 *
 * - `email` se muestra como read-only (no editable desde acá; cambios de
 *   email requieren flow aparte por verificación).
 * - Solo se envían los campos que efectivamente cambiaron — evita PATCH
 *   "vacíos" y mantiene el contrato con `UpdateProfileInput` (todos opt).
 */
export function ProfileForm() {
  const { me, isLoading } = useAuth();
  const updateProfile = useUpdateProfile();

  const [form, setForm] = useState<FormState>({ name: '', phone: '' });
  const [error, setError] = useState<string | null>(null);

  // Sync state cuando `me` se hidrata o cambia desde otra parte de la app.
  useEffect(() => {
    if (me) {
      setForm({ name: me.name ?? '', phone: me.phone ?? '' });
    }
  }, [me]);

  const isPending = updateProfile.isPending;
  const isDisabled = isPending || isLoading || !me;

  function buildInput(): UpdateProfileInput | null {
    if (!me) return null;
    const next: UpdateProfileInput = {};
    const trimmedName = form.name.trim();
    const trimmedPhone = form.phone.trim();

    if (trimmedName !== (me.name ?? '')) {
      next.name = trimmedName;
    }
    // `phone` puede vaciarse intencionalmente — mandamos string vacío
    // para que el back lo limpie (el contrato lo acepta como opcional).
    if (trimmedPhone !== (me.phone ?? '')) {
      next.phone = trimmedPhone;
    }

    return next;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!me) return;

    const trimmedName = form.name.trim();
    if (!trimmedName) {
      setError('El nombre no puede quedar vacío.');
      return;
    }

    const input = buildInput();
    if (!input || Object.keys(input).length === 0) {
      toast.info('No hay cambios para guardar');
      return;
    }

    try {
      await updateProfile.mutateAsync(input);
      toast.success('Perfil actualizado');
    } catch (err) {
      const msg =
        err instanceof ApiError
          ? err.message
          : 'No se pudo actualizar el perfil. Intentá de nuevo.';
      setError(msg);
      toast.error(msg);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <Input
        type="email"
        label="Email"
        value={me?.email ?? ''}
        readOnly
        disabled
        hint="El email no se puede cambiar desde acá."
        autoComplete="email"
      />
      <Input
        label="Nombre"
        autoComplete="name"
        required
        value={form.name}
        onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
        disabled={isDisabled}
      />
      <Input
        label="Teléfono"
        type="tel"
        placeholder="+51 999 999 999"
        autoComplete="tel"
        value={form.phone}
        onChange={(e) => setForm((s) => ({ ...s, phone: e.target.value }))}
        disabled={isDisabled}
        hint="Opcional"
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
        <Button
          type="submit"
          size="md"
          loading={isPending}
          disabled={isDisabled}
        >
          {isPending ? 'Guardando…' : 'Guardar cambios'}
        </Button>
      </div>
    </form>
  );
}
