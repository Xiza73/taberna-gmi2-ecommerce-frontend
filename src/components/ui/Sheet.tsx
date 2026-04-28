import { type ReactNode } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@/utils/cn';

/**
 * Sheet — Dialog de Radix configurado como drawer lateral. Por ahora solo
 * soporta `side="right"` (suficiente para el cart). Se monta al `RootLayout`
 * con state controlado externamente (Zustand del cart UI).
 *
 * Uso:
 *   <Sheet open={isOpen} onOpenChange={set}>
 *     <SheetContent>
 *       <SheetHeader>...</SheetHeader>
 *       <SheetBody>...</SheetBody>
 *       <SheetFooter>...</SheetFooter>
 *     </SheetContent>
 *   </Sheet>
 */

interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
}

export function Sheet({ open, onOpenChange, children }: SheetProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      {children}
    </Dialog.Root>
  );
}

interface SheetContentProps {
  children: ReactNode;
  /** Título accesible — obligatorio para a11y; se renderiza visualmente en `<SheetHeader>`. */
  title: string;
  className?: string;
}

export function SheetContent({ children, title, className }: SheetContentProps) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay
        className={cn(
          'fixed inset-0 z-40 bg-foreground/30 backdrop-blur-sm',
          'data-[state=open]:animate-in data-[state=open]:fade-in-0',
          'data-[state=closed]:animate-out data-[state=closed]:fade-out-0',
        )}
      />
      <Dialog.Content
        className={cn(
          'fixed right-0 top-0 z-50 h-full w-full sm:max-w-md',
          'bg-background shadow-2xl border-l border-border',
          'flex flex-col',
          'data-[state=open]:animate-in data-[state=open]:slide-in-from-right',
          'data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right',
          'duration-300',
          className,
        )}
      >
        <Dialog.Title className="sr-only">{title}</Dialog.Title>
        {children}
      </Dialog.Content>
    </Dialog.Portal>
  );
}

interface SheetHeaderProps {
  title: ReactNode;
  subtitle?: ReactNode;
}

export function SheetHeader({ title, subtitle }: SheetHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-3 px-5 py-4 border-b border-border">
      <div className="min-w-0">
        <h2
          className="text-xl"
          style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}
        >
          {title}
        </h2>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
        )}
      </div>
      <Dialog.Close
        aria-label="Cerrar"
        className="p-1.5 -m-1.5 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
      >
        <X size={18} />
      </Dialog.Close>
    </div>
  );
}

export function SheetBody({ children }: { children: ReactNode }) {
  return <div className="flex-1 overflow-y-auto">{children}</div>;
}

export function SheetFooter({ children }: { children: ReactNode }) {
  return <div className="px-5 py-4 border-t border-border bg-muted/30">{children}</div>;
}
