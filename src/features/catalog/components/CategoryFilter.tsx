import type { Category } from '@/types/category';
import { cn } from '@/utils/cn';

interface Props {
  categories: Category[];
  /** `null` representa "Todas". */
  selectedCategoryId: string | null;
  onSelect: (categoryId: string | null) => void;
  isLoading?: boolean;
}

export function CategoryFilter({
  categories,
  selectedCategoryId,
  onSelect,
  isLoading = false,
}: Props) {
  if (isLoading) {
    return (
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-10 w-24 rounded-sm bg-muted animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Pill
        active={selectedCategoryId === null}
        onClick={() => onSelect(null)}
      >
        Todas
      </Pill>
      {categories.map((cat) => (
        <Pill
          key={cat.id}
          active={selectedCategoryId === cat.id}
          onClick={() => onSelect(cat.id)}
        >
          {cat.name}
        </Pill>
      ))}
    </div>
  );
}

interface PillProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

function Pill({ active, onClick, children }: PillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'px-4 py-2 rounded-sm text-sm tracking-wide transition-colors',
        active
          ? 'bg-foreground text-background'
          : 'bg-muted text-foreground hover:bg-secondary',
      )}
    >
      {children}
    </button>
  );
}
