import { Sparkles } from 'lucide-react';

/**
 * Homepage placeholder. Va a ser reemplazada por la home real (header sticky,
 * banner carousel, features section, products grid, newsletter, footer)
 * cuando lleguen los PRs de layout/home/catálogo.
 */
export function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="max-w-md text-center space-y-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
          <Sparkles size={28} className="text-primary" />
        </div>
        <div>
          <h1
            className="text-5xl mb-2"
            style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}
          >
            Lumière
          </h1>
          <p className="text-sm tracking-wide text-muted-foreground uppercase">
            Estilo atemporal · Calidad excepcional
          </p>
        </div>
        <p className="text-base text-muted-foreground leading-relaxed">
          Storefront listo para arrancar. Las features (auth, catálogo, carrito,
          checkout, mi cuenta) entran en PRs siguientes.
        </p>
        <p className="text-xs text-muted-foreground/70">
          Bootstrap inicial — React 19 · Vite · Tailwind 4 · TanStack Query/Router
        </p>
      </div>
    </main>
  );
}
