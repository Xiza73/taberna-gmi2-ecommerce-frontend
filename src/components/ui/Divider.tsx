import { cn } from '@/utils/cn';

interface Props {
  /** If provided, renders the label centered between two horizontal lines. */
  label?: string;
  className?: string;
}

export function Divider({ label, className }: Props) {
  if (!label) {
    return <hr className={cn('border-t border-border', className)} />;
  }
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <span className="flex-1 border-t border-border" />
      <span className="text-xs text-muted-foreground uppercase tracking-wider">
        {label}
      </span>
      <span className="flex-1 border-t border-border" />
    </div>
  );
}
