import { Sparkles } from 'lucide-react';

/**
 * Homepage placeholder. Vive dentro del `MainLayout` (header + footer).
 * Se reemplaza por la home real (banner carousel, features section,
 * products grid, newsletter) en PRs siguientes.
 */
export function HomePage() {
  return (
    <main className="mx-auto max-w-[1400px] px-4 lg:px-8 py-16 lg:py-24">
      <div className="max-w-md mx-auto text-center space-y-6">
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
          Las features de catálogo, carrito, checkout y mi cuenta entran en
          los PRs siguientes.
        </p>
      </div>
    </main>
  );
}
