import { ChevronDown } from 'lucide-react';
import type { ProductSortBy } from '@/types/product';

interface Props {
  value: ProductSortBy;
  onChange: (next: ProductSortBy) => void;
}

const SORT_OPTIONS: { value: ProductSortBy; label: string }[] = [
  { value: 'newest', label: 'Más recientes' },
  { value: 'price', label: 'Precio: menor a mayor' },
  { value: 'price_desc', label: 'Precio: mayor a menor' },
  { value: 'name', label: 'Nombre A → Z' },
  { value: 'rating', label: 'Mejor valorados' },
];

export function SortDropdown({ value, onChange }: Props) {
  return (
    <label className="relative flex items-center gap-2 text-sm">
      <span className="text-muted-foreground hidden sm:inline">Ordenar por</span>
      <span className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value as ProductSortBy)}
          className="appearance-none bg-input-background border border-border rounded-sm pl-3 pr-9 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 cursor-pointer"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={14}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
        />
      </span>
    </label>
  );
}
