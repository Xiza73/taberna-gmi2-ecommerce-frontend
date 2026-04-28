import { useEffect, useRef, useState } from 'react';
import { Search, X } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';

interface Props {
  /** Valor inicial leído de los search params (uncontrolled internal state). */
  initialValue?: string;
  /** Se dispara con el valor debounced (300ms). */
  onSearch: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
}

/**
 * Search input controlado internamente. Solo emite el valor debounced para
 * no spamear la API. Si el padre cambia `initialValue` (ej al limpiar
 * filtros desde otro lado), se sincroniza.
 */
export function SearchInput({
  initialValue = '',
  onSearch,
  placeholder = 'Buscar productos…',
  debounceMs = 300,
}: Props) {
  const [value, setValue] = useState(initialValue);
  const debounced = useDebounce(value, debounceMs);
  const lastEmittedRef = useRef(initialValue);

  // Sync from parent (only if it differs from the user's current input AND
  // from the last value we already emitted upstream).
  useEffect(() => {
    if (initialValue !== value && initialValue !== lastEmittedRef.current) {
      setValue(initialValue);
      lastEmittedRef.current = initialValue;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValue]);

  // Emit debounced changes upstream.
  useEffect(() => {
    if (debounced !== lastEmittedRef.current) {
      lastEmittedRef.current = debounced;
      onSearch(debounced);
    }
  }, [debounced, onSearch]);

  return (
    <div className="relative w-full sm:max-w-xs">
      <Search
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
      />
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="w-full h-10 pl-9 pr-9 rounded-sm border border-border bg-input-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring"
      />
      {value && (
        <button
          type="button"
          onClick={() => setValue('')}
          aria-label="Limpiar búsqueda"
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
