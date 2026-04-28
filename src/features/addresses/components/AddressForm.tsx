import { type FormEvent, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ApiError } from '@/api/errors';
import type {
  Address,
  CreateAddressInput,
  UpdateAddressInput,
} from '@/types/address';
import {
  useCreateAddress,
  useUpdateAddress,
} from '../hooks/useAddresses';

interface Props {
  /** Si se pasa, modo edición. */
  address?: Address;
  onSuccess: () => void;
  onCancel: () => void;
}

interface FormState {
  label: string;
  recipientName: string;
  phone: string;
  street: string;
  district: string;
  city: string;
  department: string;
  zipCode: string;
  reference: string;
}

function initialState(address?: Address): FormState {
  return {
    label: address?.label ?? '',
    recipientName: address?.recipientName ?? '',
    phone: address?.phone ?? '',
    street: address?.street ?? '',
    district: address?.district ?? '',
    city: address?.city ?? '',
    department: address?.department ?? '',
    zipCode: address?.zipCode ?? '',
    reference: address?.reference ?? '',
  };
}

export function AddressForm({ address, onSuccess, onCancel }: Props) {
  const [form, setForm] = useState<FormState>(() => initialState(address));
  const [error, setError] = useState<string | null>(null);

  const createMutation = useCreateAddress();
  const updateMutation = useUpdateAddress();

  const isEdit = Boolean(address);
  const isPending = createMutation.isPending || updateMutation.isPending;

  function bind<K extends keyof FormState>(key: K) {
    return {
      value: form[key],
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm((s) => ({ ...s, [key]: e.target.value })),
      disabled: isPending,
    };
  }

  function buildInput(): CreateAddressInput {
    return {
      label: form.label.trim(),
      recipientName: form.recipientName.trim(),
      phone: form.phone.trim(),
      street: form.street.trim(),
      district: form.district.trim(),
      city: form.city.trim(),
      department: form.department.trim(),
      zipCode: form.zipCode.trim() || undefined,
      reference: form.reference.trim() || undefined,
    };
  }

  function validate(input: CreateAddressInput): string | null {
    const requiredKeys: (keyof CreateAddressInput)[] = [
      'label',
      'recipientName',
      'phone',
      'street',
      'district',
      'city',
      'department',
    ];
    for (const k of requiredKeys) {
      if (!input[k]) return 'Completá todos los campos requeridos.';
    }
    return null;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const input = buildInput();
    const validationError = validate(input);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      if (address) {
        const update: UpdateAddressInput = input;
        await updateMutation.mutateAsync({ id: address.id, input: update });
      } else {
        await createMutation.mutateAsync(input);
      }
      onSuccess();
    } catch (err) {
      const msg =
        err instanceof ApiError
          ? err.message
          : `No se pudo ${isEdit ? 'actualizar' : 'crear'} la dirección.`;
      setError(msg);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <Input label="Etiqueta" placeholder="Casa, Oficina…" required {...bind('label')} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Input
          label="Nombre de quien recibe"
          autoComplete="name"
          required
          {...bind('recipientName')}
        />
        <Input
          label="Teléfono"
          type="tel"
          placeholder="+51 999 999 999"
          autoComplete="tel"
          required
          {...bind('phone')}
        />
      </div>

      <Input
        label="Dirección"
        placeholder="Av. Larco 123, Dpto 4B"
        autoComplete="street-address"
        required
        {...bind('street')}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Input label="Distrito" required {...bind('district')} />
        <Input label="Ciudad" required {...bind('city')} />
        <Input label="Departamento" required {...bind('department')} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Input label="Código postal" hint="Opcional" {...bind('zipCode')} />
        <Input
          label="Referencia"
          placeholder="Frente al parque…"
          hint="Opcional"
          {...bind('reference')}
        />
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive"
        >
          {error}
        </div>
      )}

      <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-2">
        <Button
          type="button"
          variant="outline"
          size="md"
          onClick={onCancel}
          disabled={isPending}
        >
          Cancelar
        </Button>
        <Button type="submit" size="md" loading={isPending} disabled={isPending}>
          {isEdit ? 'Guardar cambios' : 'Crear dirección'}
        </Button>
      </div>
    </form>
  );
}
