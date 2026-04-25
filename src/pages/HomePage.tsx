import { ShoppingBag } from 'lucide-react';

/**
 * Homepage placeholder. Va a ser reemplazada por la home real
 * (banners + carousel de productos destacados + categorías) cuando
 * llegue el código del Figma.
 */
export function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="max-w-md text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10">
          <ShoppingBag size={32} className="text-primary" />
        </div>
        <h1 className="text-3xl tracking-tight">ECommerce</h1>
        <p className="text-sm text-muted-foreground">
          Storefront listo para arrancar. Las features (catálogo, carrito,
          checkout, mi cuenta) entran en PRs siguientes.
        </p>
        <p className="text-xs text-muted-foreground/70">
          Bootstrap inicial — React 19 · Vite · Tailwind 4 · TanStack Query/Router
        </p>
      </div>
    </main>
  );
}
