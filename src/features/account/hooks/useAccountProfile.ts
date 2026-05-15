import { useMutation, useQueryClient } from '@tanstack/react-query';
import { customerAuthApi } from '@/api/customerAuthApi';
import { authKeys } from '@/features/auth';
import type {
  ChangePasswordInput,
  CustomerMe,
  UpdateProfileInput,
} from '@/types/auth';

/**
 * Mutation para actualizar el perfil del customer (name, phone).
 *
 * En `onSuccess` invalida `authKeys.me` para que la UI (header, sidebar de
 * /account) refleje los datos nuevos sin requerir un refresh manual.
 */
export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateProfileInput) =>
      customerAuthApi.updateProfile(input),
    onSuccess: (updated: CustomerMe) => {
      // Optimización: seedear el cache con la respuesta del back antes de
      // invalidar, así el siguiente refetch ya parte de la versión nueva.
      qc.setQueryData(authKeys.me, updated);
      void qc.invalidateQueries({ queryKey: authKeys.me });
    },
  });
}

/**
 * Mutation para cambiar la contraseña del customer.
 *
 * El back invalida los refresh tokens viejos (excepto el actual). No hay
 * cache que invalidar — los tokens ya están seteados via `apiClient`.
 */
export function useChangePassword() {
  return useMutation({
    mutationFn: (input: ChangePasswordInput) =>
      customerAuthApi.changePassword(input),
  });
}
