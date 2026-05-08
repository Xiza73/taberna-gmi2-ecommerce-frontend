import { create } from 'zustand';
import type {
  CustomerDocType,
  PaymentMethod,
  ShippingMethod,
} from '@/types/order';

export type CheckoutStep = 'shipping' | 'payment' | 'review';

const STEP_ORDER: CheckoutStep[] = ['shipping', 'payment', 'review'];

interface CheckoutState {
  currentStep: CheckoutStep;
  shippingMethod: ShippingMethod;
  /** ID de la address seleccionada. Null hasta que el customer elija. */
  addressId: string | null;
  paymentMethod: PaymentMethod;
  /** Toggle de "necesito boleta o factura". */
  invoiceEnabled: boolean;
  customerDocType: CustomerDocType;
  customerDocNumber: string;
  notes: string;

  setStep: (step: CheckoutStep) => void;
  goNext: () => void;
  goBack: () => void;
  setShippingMethod: (m: ShippingMethod) => void;
  setAddressId: (id: string | null) => void;
  setPaymentMethod: (m: PaymentMethod) => void;
  setInvoiceEnabled: (v: boolean) => void;
  setCustomerDocType: (t: CustomerDocType) => void;
  setCustomerDocNumber: (n: string) => void;
  setNotes: (n: string) => void;
  reset: () => void;
}

const initialState: Omit<
  CheckoutState,
  | 'setStep'
  | 'goNext'
  | 'goBack'
  | 'setShippingMethod'
  | 'setAddressId'
  | 'setPaymentMethod'
  | 'setInvoiceEnabled'
  | 'setCustomerDocType'
  | 'setCustomerDocNumber'
  | 'setNotes'
  | 'reset'
> = {
  currentStep: 'shipping',
  shippingMethod: 'standard',
  addressId: null,
  paymentMethod: 'mercadopago',
  invoiceEnabled: false,
  customerDocType: 'dni',
  customerDocNumber: '',
  notes: '',
};

/**
 * Estado UI del flow de checkout. NO se persiste — al refrescar la página
 * el wizard arranca de cero. Si se requiere "guardar progreso" en el
 * futuro, agregamos `persist` middleware.
 */
export const useCheckoutStore = create<CheckoutState>((set, get) => ({
  ...initialState,
  setStep: (step) => set({ currentStep: step }),
  goNext: () => {
    const { currentStep } = get();
    const idx = STEP_ORDER.indexOf(currentStep);
    if (idx >= 0 && idx < STEP_ORDER.length - 1) {
      set({ currentStep: STEP_ORDER[idx + 1] });
    }
  },
  goBack: () => {
    const { currentStep } = get();
    const idx = STEP_ORDER.indexOf(currentStep);
    if (idx > 0) {
      set({ currentStep: STEP_ORDER[idx - 1] });
    }
  },
  setShippingMethod: (shippingMethod) => set({ shippingMethod }),
  setAddressId: (addressId) => set({ addressId }),
  setPaymentMethod: (paymentMethod) => set({ paymentMethod }),
  setInvoiceEnabled: (invoiceEnabled) => set({ invoiceEnabled }),
  setCustomerDocType: (customerDocType) => set({ customerDocType }),
  setCustomerDocNumber: (customerDocNumber) => set({ customerDocNumber }),
  setNotes: (notes) => set({ notes }),
  reset: () => set(initialState),
}));

export const CHECKOUT_STEP_ORDER = STEP_ORDER;
