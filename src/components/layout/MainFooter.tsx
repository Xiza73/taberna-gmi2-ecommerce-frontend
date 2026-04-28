import { Link } from '@tanstack/react-router';
import { Sparkles } from 'lucide-react';
import { buildProductsSearch, useCategories } from '@/features/catalog';

/**
 * Footer principal del storefront. 4 columnas en desktop, stack en mobile.
 * - "Comprar" usa categorías top-level reales del back (vía useCategories).
 * - "Ayuda" y "Empresa" siguen siendo placeholders hasta sus PRs.
 */

interface FooterLink {
  label: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

const STATIC_SECTIONS: FooterSection[] = [
  {
    title: 'Ayuda',
    links: [
      { label: 'Envíos' },
      { label: 'Devoluciones' },
      { label: 'Guía de tallas' },
      { label: 'Contacto' },
    ],
  },
  {
    title: 'Empresa',
    links: [
      { label: 'Sobre nosotros' },
      { label: 'Sostenibilidad' },
      { label: 'Trabajá con nosotros' },
      { label: 'Términos y condiciones' },
    ],
  },
];

const MAX_FOOTER_CATEGORIES = 5;

export function MainFooter() {
  const year = new Date().getFullYear();
  const { topLevel: categories } = useCategories();
  const shopCategories = categories.slice(0, MAX_FOOTER_CATEGORIES);

  return (
    <footer className="border-t border-border bg-secondary/40 mt-16">
      <div className="mx-auto max-w-[1400px] px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand column */}
          <div className="space-y-3">
            <Link to="/" className="inline-flex items-center gap-2 group">
              <span className="w-9 h-9 rounded-full bg-primary flex items-center justify-center transition-transform group-hover:scale-105">
                <Sparkles size={16} className="text-primary-foreground" />
              </span>
              <span
                className="text-xl tracking-tight"
                style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}
              >
                Lumière
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Estilo atemporal y calidad excepcional para cada momento.
            </p>
          </div>

          {/* Comprar (dynamic from categories) */}
          <div>
            <h4 className="mb-3 text-foreground" style={{ fontWeight: 500 }}>
              Comprar
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  to="/products"
                  search={buildProductsSearch()}
                  className="hover:text-foreground transition-colors"
                >
                  Todos los productos
                </Link>
              </li>
              {shopCategories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    to="/products"
                    search={buildProductsSearch({ categoryId: cat.id })}
                    className="hover:text-foreground transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Static sections */}
          {STATIC_SECTIONS.map((section) => (
            <div key={section.title}>
              <h4 className="mb-3 text-foreground" style={{ fontWeight: 500 }}>
                {section.title}
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <button
                      type="button"
                      disabled
                      className="hover:text-foreground transition-colors disabled:cursor-not-allowed text-left"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-6 border-t border-border text-center text-xs text-muted-foreground">
          <p>&copy; {year} Lumière. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
