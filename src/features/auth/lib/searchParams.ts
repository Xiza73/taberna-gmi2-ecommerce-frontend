/**
 * Shape canónico de los search params de `/login`. Coincide 1-a-1 con
 * el `validateSearch` declarado en `routeTree.ts`.
 *
 * Mismo patrón que `buildProductsSearch` — TanStack Router exige el shape
 * completo en `<Link search>` y `navigate({ search })`.
 */
export interface LoginSearch {
  redirect: string | undefined;
}

export function buildLoginSearch(
  partial: Partial<LoginSearch> = {},
): LoginSearch {
  return {
    redirect: partial.redirect,
  };
}
