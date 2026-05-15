import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { reviewsApi } from '@/api/reviewsApi';
import type { CreateReviewInput } from '@/types/reviews';

export const reviewsKeys = {
  byProduct: (productId: string) =>
    ['reviews', 'product', productId] as const,
};

interface UseProductReviewsParams {
  page?: number;
  limit?: number;
  enabled?: boolean;
}

export function useProductReviews(
  productId: string | undefined,
  params: UseProductReviewsParams = {},
) {
  const { page = 1, limit = 10, enabled = true } = params;
  return useQuery({
    queryKey: [...reviewsKeys.byProduct(productId ?? ''), { page, limit }],
    queryFn: () =>
      reviewsApi.listByProduct(productId as string, { page, limit }),
    enabled: Boolean(productId) && enabled,
    staleTime: 30_000,
    placeholderData: keepPreviousData,
  });
}

/**
 * Crea una review e invalida la lista pública del producto. La review queda
 * pendiente de moderación, así que probablemente no aparezca al refetch — el
 * mensaje de éxito lo aclara.
 */
export function useCreateReview(productId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateReviewInput) =>
      reviewsApi.create(productId, input),
    onSuccess: () => {
      void qc.invalidateQueries({
        queryKey: reviewsKeys.byProduct(productId),
      });
    },
  });
}
