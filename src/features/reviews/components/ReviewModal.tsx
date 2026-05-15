import { Modal, ModalContent } from '@/components/ui/Modal';
import { ReviewForm } from './ReviewForm';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId: string;
  orderId: string;
  productName: string;
}

export function ReviewModal({
  open,
  onOpenChange,
  productId,
  orderId,
  productName,
}: Props) {
  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent
        title="Escribir reseña"
        description={`¿Qué te pareció ${productName}?`}
      >
        <ReviewForm
          productId={productId}
          orderId={orderId}
          onSuccess={() => onOpenChange(false)}
          onCancel={() => onOpenChange(false)}
        />
      </ModalContent>
    </Modal>
  );
}
