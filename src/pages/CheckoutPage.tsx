import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import { useCart } from '@/features/cart';
import {
  CHECKOUT_STEP_ORDER,
  isManualPaymentMethod,
  OrderSummary,
  resolveShippingCost,
  Step1Shipping,
  Step2Payment,
  Step3Review,
  useCheckoutStore,
} from '@/features/checkout';
import { useCreateOrder } from '@/features/orders';
import { ApiError } from '@/api/errors';
import { Stepper } from '@/components/ui/Stepper';
import { buildProductsSearch } from '@/features/catalog';

const STEPS = [
  { id: 'shipping', label: 'Envío' },
  { id: 'payment', label: 'Pago' },
  { id: 'review', label: 'Resumen' },
];

export function CheckoutPage() {
  const navigate = useNavigate();
  const cart = useCart();
  const currentStep = useCheckoutStore((s) => s.currentStep);
  const setStep = useCheckoutStore((s) => s.setStep);
  const goNext = useCheckoutStore((s) => s.goNext);
  const goBack = useCheckoutStore((s) => s.goBack);
  const reset = useCheckoutStore((s) => s.reset);

  const shippingMethod = useCheckoutStore((s) => s.shippingMethod);
  const addressId = useCheckoutStore((s) => s.addressId);
  const paymentMethod = useCheckoutStore((s) => s.paymentMethod);
  const invoiceEnabled = useCheckoutStore((s) => s.invoiceEnabled);
  const docType = useCheckoutStore((s) => s.customerDocType);
  const docNumber = useCheckoutStore((s) => s.customerDocNumber);
  const notes = useCheckoutStore((s) => s.notes);

  const createOrder = useCreateOrder();

  const itemsLoading = cart.isLoading;
  const isCartEmpty = !itemsLoading && cart.items.length === 0;

  // Si el cart se vacía mientras estás en checkout (logout, manual clear),
  // volver al catálogo.
  useEffect(() => {
    if (isCartEmpty) {
      void navigate({ to: '/products', search: buildProductsSearch() });
    }
  }, [isCartEmpty, navigate]);

  // Reset del wizard al desmontar (entrar a checkout siempre arranca limpio).
  useEffect(() => {
    return () => reset();
  }, [reset]);

  const currentIndex = CHECKOUT_STEP_ORDER.indexOf(currentStep);

  async function handleConfirm() {
    if (!addressId) {
      toast.error('Falta seleccionar una dirección.');
      setStep('shipping');
      return;
    }
    try {
      const order = await createOrder.mutateAsync({
        addressId,
        paymentMethod,
        shippingMethod,
        notes: notes.trim() || undefined,
        customerDocType: invoiceEnabled ? docType : undefined,
        customerDocNumber:
          invoiceEnabled && docNumber.trim() ? docNumber.trim() : undefined,
      });

      reset();

      if (paymentMethod === 'mercadopago' && order.paymentUrl) {
        // Redirige al checkout de MercadoPago.
        window.location.assign(order.paymentUrl);
        return;
      }

      if (isManualPaymentMethod(paymentMethod)) {
        void navigate({
          to: '/payment/manual/$orderId',
          params: { orderId: order.id },
        });
        return;
      }

      // Fallback: MP sin paymentUrl (preferencia falló) o algún otro caso —
      // la página de manual también sirve para mostrar el orderNumber + retry.
      void navigate({
        to: '/payment/manual/$orderId',
        params: { orderId: order.id },
      });
    } catch (err) {
      const msg =
        err instanceof ApiError
          ? err.message
          : 'No se pudo crear el pedido. Intentá de nuevo.';
      toast.error(msg);
    }
  }

  return (
    <main className="mx-auto max-w-[1400px] px-4 lg:px-8 py-6 lg:py-10">
      <header className="mb-6 lg:mb-8">
        <h1
          className="text-2xl lg:text-3xl mb-1"
          style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}
        >
          Finalizar compra
        </h1>
      </header>

      <div className="mb-8">
        <Stepper
          steps={STEPS}
          currentIndex={currentIndex}
          onStepClick={(idx) => {
            const step = CHECKOUT_STEP_ORDER[idx];
            if (step) setStep(step);
          }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 lg:gap-10 items-start">
        <div>
          {currentStep === 'shipping' && <Step1Shipping onContinue={goNext} />}
          {currentStep === 'payment' && (
            <Step2Payment onContinue={goNext} onBack={goBack} />
          )}
          {currentStep === 'review' && (
            <Step3Review
              items={cart.items}
              onBack={goBack}
              onConfirm={() => void handleConfirm()}
              isPlacingOrder={createOrder.isPending}
            />
          )}
        </div>

        <OrderSummary
          items={cart.items}
          subtotal={cart.total}
          shippingMethod={shippingMethod}
          shippingCost={resolveShippingCost(shippingMethod)}
        />
      </div>
    </main>
  );
}
