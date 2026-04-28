import * as Dialog from '@radix-ui/react-dialog';
import { Button } from './Button';
import { Modal, ModalContent } from './Modal';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** `destructive` = botón rojo (default). `primary` = botón coral. */
  variant?: 'destructive' | 'primary';
  onConfirm: () => void;
  isPending?: boolean;
}

/**
 * Confirmación simple — Modal con título, mensaje y dos botones (cancelar /
 * confirmar). Ideal para deletes o acciones irreversibles.
 */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  message,
  confirmLabel = 'Eliminar',
  cancelLabel = 'Cancelar',
  variant = 'destructive',
  onConfirm,
  isPending = false,
}: Props) {
  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent title={title} maxWidth="max-w-sm">
        <p className="text-sm text-muted-foreground leading-relaxed">{message}</p>
        <div className="mt-5 flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
          <Dialog.Close asChild>
            <Button variant="outline" size="md" disabled={isPending}>
              {cancelLabel}
            </Button>
          </Dialog.Close>
          <Button
            variant={variant === 'destructive' ? 'destructive' : 'primary'}
            size="md"
            loading={isPending}
            onClick={onConfirm}
            disabled={isPending}
          >
            {confirmLabel}
          </Button>
        </div>
      </ModalContent>
    </Modal>
  );
}
