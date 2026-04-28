import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addressesApi } from '@/api/addressesApi';
import type { CreateAddressInput, UpdateAddressInput } from '@/types/address';

export const addressesKeys = {
  all: ['addresses'] as const,
  list: () => [...addressesKeys.all, 'list'] as const,
};

interface UseAddressesOptions {
  enabled?: boolean;
}

export function useAddresses(options: UseAddressesOptions = {}) {
  return useQuery({
    queryKey: addressesKeys.list(),
    queryFn: addressesApi.list,
    staleTime: 60_000,
    enabled: options.enabled ?? true,
  });
}

export function useCreateAddress() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateAddressInput) => addressesApi.create(input),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: addressesKeys.list() });
    },
  });
}

export function useUpdateAddress() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateAddressInput }) =>
      addressesApi.update(id, input),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: addressesKeys.list() });
    },
  });
}

export function useDeleteAddress() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => addressesApi.remove(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: addressesKeys.list() });
    },
  });
}

export function useSetDefaultAddress() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => addressesApi.setDefault(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: addressesKeys.list() });
    },
  });
}
