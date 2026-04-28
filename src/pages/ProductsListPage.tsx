import { useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from '@tanstack/react-router';
import {
  buildProductsSearch,
  CategoryFilter,
  Pagination,
  ProductGrid,
  SearchInput,
  SortDropdown,
  useCategories,
  useProducts,
} from '@/features/catalog';
import type { Category } from '@/types/category';
import type { ProductSortBy, ProductsQuery } from '@/types/product';

const VALID_SORT: ProductSortBy[] = [
  'newest',
  'price',
  'price_desc',
  'name',
  'rating',
];
const DEFAULT_LIMIT = 20;

interface PageFilters {
  categoryId: string | null;
  search: string;
  sortBy: ProductSortBy;
  page: number;
}

/**
 * Lectura de filtros desde el query string. Mantenemos el parser manual
 * (mismo patrón que el backoffice) para evitar fricción con los types de
 * `useSearch` cuando el path tiene id pathless en el árbol.
 */
function parseFilters(searchStr: string): PageFilters {
  const params = new URLSearchParams(searchStr);
  const sortByRaw = params.get('sortBy');
  const sortBy: ProductSortBy =
    sortByRaw && (VALID_SORT as string[]).includes(sortByRaw)
      ? (sortByRaw as ProductSortBy)
      : 'newest';
  const pageRaw = Number(params.get('page'));
  const page = Number.isFinite(pageRaw) && pageRaw > 0 ? Math.floor(pageRaw) : 1;
  return {
    categoryId: params.get('categoryId') || null,
    search: params.get('search') || '',
    sortBy,
    page,
  };
}

function filtersToSearch(filters: PageFilters) {
  return buildProductsSearch({
    categoryId: filters.categoryId ?? undefined,
    search: filters.search || undefined,
    sortBy: filters.sortBy === 'newest' ? undefined : filters.sortBy,
    page: filters.page > 1 ? filters.page : undefined,
  });
}

export function ProductsListPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const filters = useMemo(
    () => parseFilters(location.searchStr),
    [location.searchStr],
  );

  const updateFilters = useCallback(
    (next: Partial<PageFilters>, options: { resetPage?: boolean } = {}) => {
      const merged: PageFilters = {
        ...filters,
        ...next,
        page: options.resetPage ? 1 : (next.page ?? filters.page),
      };
      void navigate({
        to: '/products',
        search: filtersToSearch(merged),
      });
    },
    [filters, navigate],
  );

  const productsQuery: ProductsQuery = {
    page: filters.page,
    limit: DEFAULT_LIMIT,
    categoryId: filters.categoryId ?? undefined,
    search: filters.search || undefined,
    sortBy: filters.sortBy,
  };

  const { data, isLoading, isFetching, isError, error } = useProducts(productsQuery);
  const {
    data: categoriesData,
    topLevel: topCategories,
    isLoading: isCategoriesLoading,
  } = useCategories();

  const categoriesById = useMemo(() => {
    const m = new Map<string, Category>();
    if (!categoriesData) return m;
    for (const c of categoriesData) m.set(c.id, c);
    return m;
  }, [categoriesData]);

  return (
    <main className="mx-auto max-w-[1400px] px-4 lg:px-8 py-10 lg:py-14">
      <header className="mb-8 lg:mb-10">
        <h1
          className="text-3xl lg:text-4xl mb-2"
          style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}
        >
          Productos
        </h1>
        <p className="text-sm text-muted-foreground">
          Explorá nuestra colección y encontrá tu próxima pieza favorita.
        </p>
      </header>

      <div className="space-y-4 mb-8">
        <CategoryFilter
          categories={topCategories}
          selectedCategoryId={filters.categoryId}
          onSelect={(categoryId) =>
            updateFilters({ categoryId }, { resetPage: true })
          }
          isLoading={isCategoriesLoading}
        />

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <SearchInput
            initialValue={filters.search}
            onSearch={(search) => updateFilters({ search }, { resetPage: true })}
          />
          <SortDropdown
            value={filters.sortBy}
            onChange={(sortBy) => updateFilters({ sortBy }, { resetPage: true })}
          />
        </div>
      </div>

      {isError ? (
        <div className="rounded-md border border-destructive/30 bg-destructive/5 p-6">
          <p className="text-sm text-destructive">
            No se pudieron cargar los productos.
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {error instanceof Error ? error.message : 'Error desconocido'}
          </p>
        </div>
      ) : (
        <ProductGrid
          products={data?.items ?? []}
          categoriesById={categoriesById}
          isLoading={isLoading}
        />
      )}

      {data && data.totalPages > 1 && (
        <div className="mt-12">
          <Pagination
            page={filters.page}
            totalPages={data.totalPages}
            onChange={(page) => {
              updateFilters({ page });
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            disabled={isFetching}
          />
        </div>
      )}
    </main>
  );
}
