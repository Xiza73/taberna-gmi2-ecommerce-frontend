import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface Props {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
  disabled?: boolean;
}

/**
 * Pagination simple prev / next + indicador "Página X de Y". Si solo hay 1
 * página (o 0), no renderiza nada.
 */
export function Pagination({ page, totalPages, onChange, disabled = false }: Props) {
  if (totalPages <= 1) return null;

  const canPrev = page > 1 && !disabled;
  const canNext = page < totalPages && !disabled;

  return (
    <nav
      role="navigation"
      aria-label="Paginación"
      className="flex items-center justify-center gap-3"
    >
      <Button
        variant="outline"
        size="sm"
        onClick={() => canPrev && onChange(page - 1)}
        disabled={!canPrev}
        aria-label="Página anterior"
      >
        <ChevronLeft size={14} />
        <span className="hidden sm:inline">Anterior</span>
      </Button>

      <span className="text-sm text-muted-foreground tabular-nums">
        Página <span className="text-foreground">{page}</span> de{' '}
        <span className="text-foreground">{totalPages}</span>
      </span>

      <Button
        variant="outline"
        size="sm"
        onClick={() => canNext && onChange(page + 1)}
        disabled={!canNext}
        aria-label="Página siguiente"
      >
        <span className="hidden sm:inline">Siguiente</span>
        <ChevronRight size={14} />
      </Button>
    </nav>
  );
}
