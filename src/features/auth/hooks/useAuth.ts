import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { customerAuthApi } from '@/api/customerAuthApi';
import type { CustomerMe, LoginInput, RegisterInput } from '@/types/auth';

export const authKeys = {
  me: ['auth', 'me'] as const,
};

interface UseAuthReturn {
  me: CustomerMe | undefined;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (input: LoginInput) => Promise<void>;
  isLoggingIn: boolean;
  loginError: Error | null;
  register: (input: RegisterInput) => Promise<void>;
  isRegistering: boolean;
  registerError: Error | null;
  logout: () => Promise<void>;
  isLoggingOut: boolean;
}

export function useAuth(): UseAuthReturn {
  const qc = useQueryClient();

  const meQuery = useQuery({
    queryKey: authKeys.me,
    queryFn: customerAuthApi.me,
    retry: false,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });

  const loginMutation = useMutation({
    mutationFn: customerAuthApi.login,
    onSuccess: async () => {
      await qc.fetchQuery({ queryKey: authKeys.me, queryFn: customerAuthApi.me });
    },
  });

  const registerMutation = useMutation({
    mutationFn: customerAuthApi.register,
    onSuccess: async () => {
      await qc.fetchQuery({ queryKey: authKeys.me, queryFn: customerAuthApi.me });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: customerAuthApi.logout,
    onSettled: () => {
      qc.clear();
    },
  });

  return {
    me: meQuery.data,
    isLoading: meQuery.isLoading,
    isAuthenticated: Boolean(meQuery.data),
    login: async (input) => {
      await loginMutation.mutateAsync(input);
    },
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
    register: async (input) => {
      await registerMutation.mutateAsync(input);
    },
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error,
    logout: async () => {
      await logoutMutation.mutateAsync();
    },
    isLoggingOut: logoutMutation.isPending,
  };
}
