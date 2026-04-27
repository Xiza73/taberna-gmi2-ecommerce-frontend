import { Outlet } from '@tanstack/react-router';
import { Sparkles } from 'lucide-react';

/**
 * Layout para páginas públicas de autenticación (login, register, forgot-password,
 * reset-password). Split visual: branding Lumière a la izquierda en desktop, form
 * a la derecha. En mobile colapsa a una sola columna con header reducido.
 *
 * El guard "redirect-if-authed" vive en el route padre (`publicAuthLayoutRoute`),
 * NO acá — el layout es solo presentación.
 */
export function PublicAuthLayout() {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Branding panel — full width on mobile, half on desktop */}
      <aside className="bg-secondary text-secondary-foreground py-10 px-6 lg:py-16 lg:px-12 lg:w-[42%] lg:min-h-screen flex flex-col justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
            <Sparkles size={18} className="text-primary-foreground" />
          </div>
          <h1
            className="text-2xl tracking-tight"
            style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}
          >
            Lumière
          </h1>
        </div>

        <div className="hidden lg:block max-w-md mt-12">
          <h2
            className="text-4xl xl:text-5xl mb-4 leading-tight"
            style={{ fontFamily: 'var(--font-display)', fontWeight: 500 }}
          >
            Estilo atemporal, calidad excepcional.
          </h2>
          <p className="text-base text-secondary-foreground/70 leading-relaxed">
            Descubrí piezas cuidadosamente seleccionadas que combinan diseño,
            durabilidad y comodidad.
          </p>
        </div>

        <p className="hidden lg:block text-xs text-secondary-foreground/60 mt-12">
          &copy; {new Date().getFullYear()} Lumière. Todos los derechos reservados.
        </p>
      </aside>

      {/* Form panel */}
      <main className="flex-1 flex items-center justify-center py-10 px-6 lg:py-16 lg:px-12">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
