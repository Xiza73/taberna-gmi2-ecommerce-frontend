import type { Category } from '@/types/category';
import { apiClient } from './client';

export const categoriesApi = {
  /** Devuelve todas las categorías ACTIVAS (flat array). */
  list(): Promise<Category[]> {
    return apiClient.get<Category[]>('/categories');
  },
};
