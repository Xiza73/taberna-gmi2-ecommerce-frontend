import { Helmet } from 'react-helmet-async';
import { createElement, type ReactElement } from 'react';

interface SeoOptions {
  /** Título completo de la página. Incluí el sufijo "— Lumière" si corresponde. */
  title?: string;
  description?: string;
  /** URL absoluta o relativa para Open Graph. */
  image?: string;
  /** `website` (default), `article`, `product`, etc. */
  type?: string;
  /** Si true, agrega `<meta name="robots" content="noindex,nofollow">` (ej: /account/*). */
  noIndex?: boolean;
}

/**
 * Hook SEO por página. Devuelve un `<Helmet>` con title + meta description +
 * OG tags + Twitter card, listo para incluir en el render:
 *
 *   const seo = useSeo({ title: 'Catálogo — Lumière' });
 *   return <>{seo}<main>…</main></>;
 *
 * Los campos omitidos caen al default global del `<Helmet>` que vive en
 * `RootLayout`. No usamos JSX para que el archivo siga siendo `.ts` puro;
 * la API consumidora sí lo trata como un `ReactElement` normal.
 */
export function useSeo(options: SeoOptions): ReactElement {
  const children: ReactElement[] = [];

  if (options.title) {
    children.push(createElement('title', { key: 'title' }, options.title));
    children.push(
      createElement('meta', {
        key: 'og-title',
        property: 'og:title',
        content: options.title,
      }),
    );
    children.push(
      createElement('meta', {
        key: 'twitter-title',
        name: 'twitter:title',
        content: options.title,
      }),
    );
  }

  if (options.description) {
    children.push(
      createElement('meta', {
        key: 'description',
        name: 'description',
        content: options.description,
      }),
    );
    children.push(
      createElement('meta', {
        key: 'og-description',
        property: 'og:description',
        content: options.description,
      }),
    );
    children.push(
      createElement('meta', {
        key: 'twitter-description',
        name: 'twitter:description',
        content: options.description,
      }),
    );
  }

  if (options.image) {
    children.push(
      createElement('meta', {
        key: 'og-image',
        property: 'og:image',
        content: options.image,
      }),
    );
    children.push(
      createElement('meta', {
        key: 'twitter-image',
        name: 'twitter:image',
        content: options.image,
      }),
    );
  }

  if (options.type) {
    children.push(
      createElement('meta', {
        key: 'og-type',
        property: 'og:type',
        content: options.type,
      }),
    );
  }

  if (options.noIndex) {
    children.push(
      createElement('meta', {
        key: 'robots',
        name: 'robots',
        content: 'noindex,nofollow',
      }),
    );
  }

  return createElement(Helmet, null, ...children);
}
