import { Fragment } from 'react';
import { Link } from '@tanstack/react-router';
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  /** Si se pasa, renderiza el item como Link; si no, queda como texto. */
  to?: string;
  /**
   * Search params para el Link. Cada destino tiene su propio shape
   * (definido por el `validateSearch` de su ruta), así que acá es
   * `unknown` y se castea internamente al pasarlo al `<Link>`.
   */
  search?: unknown;
}

interface Props {
  items: BreadcrumbItem[];
}

/**
 * Breadcrumb genérico. El último item normalmente NO trae `to` (es la
 * página actual) y queda como texto resaltado.
 */
export function Breadcrumb({ items }: Props) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <Fragment key={`${item.label}-${idx}`}>
              <li>
                {item.to && !isLast ? (
                  // Cast a `unknown` necesario porque cada destino tiene su
                  // propio shape de search params (validateSearch). El
                  // breadcrumb es genérico y no conoce ese shape.
                  <Link
                    to={item.to as string}
                    search={item.search as never}
                    className="hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className={isLast ? 'text-foreground' : ''}>
                    {item.label}
                  </span>
                )}
              </li>
              {!isLast && (
                <li aria-hidden="true">
                  <ChevronRight size={12} />
                </li>
              )}
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
