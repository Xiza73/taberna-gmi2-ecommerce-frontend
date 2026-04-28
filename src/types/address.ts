/**
 * Address — espejo del `AddressResponseDto` del back. Mantenelo alineado
 * con `backend/docs/modules/addresses.md`.
 *
 * Reglas del back:
 * - Max 10 direcciones por usuario (`ADDRESS_LIMIT_REACHED`)
 * - Solo 1 puede ser `isDefault: true` a la vez (lo controla el back)
 */
export interface Address {
  id: string;
  label: string;
  recipientName: string;
  phone: string;
  street: string;
  district: string;
  city: string;
  department: string;
  zipCode: string | null;
  reference: string | null;
  isDefault: boolean;
  createdAt: string;
}

export interface CreateAddressInput {
  label: string;
  recipientName: string;
  phone: string;
  street: string;
  district: string;
  city: string;
  department: string;
  zipCode?: string;
  reference?: string;
}

export type UpdateAddressInput = Partial<CreateAddressInput>;
