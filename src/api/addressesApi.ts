import type {
  Address,
  CreateAddressInput,
  UpdateAddressInput,
} from '@/types/address';
import { apiClient } from './client';

export const addressesApi = {
  list(): Promise<Address[]> {
    return apiClient.get<Address[]>('/addresses');
  },
  create(input: CreateAddressInput): Promise<Address> {
    return apiClient.post<Address>('/addresses', input);
  },
  update(id: string, input: UpdateAddressInput): Promise<Address> {
    return apiClient.patch<Address>(`/addresses/${id}`, input);
  },
  remove(id: string): Promise<void> {
    return apiClient.delete<void>(`/addresses/${id}`);
  },
  setDefault(id: string): Promise<void> {
    return apiClient.post<void>(`/addresses/${id}/default`);
  },
};
