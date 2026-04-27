import { useMutation, useQueryClient } from '@tanstack/react-query';
import { customerAuthApi } from '@/api/customerAuthApi';
import { authKeys } from './useAuth';

/**
 * Mutation para intercambiar un `idToken` de Google por una sesión del back.
 *
 * El back verifica el JWT contra Google con el mismo `GOOGLE_CLIENT_ID` que
 * usamos en el front. Si el idToken es válido y no hay cuenta asociada, el
 * back auto-crea el customer (ver `customer.md` del back).
 */
export function useGoogleSignIn() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (idToken: string) => customerAuthApi.loginWithGoogle({ idToken }),
    onSuccess: async () => {
      await qc.fetchQuery({ queryKey: authKeys.me, queryFn: customerAuthApi.me });
    },
  });
}
