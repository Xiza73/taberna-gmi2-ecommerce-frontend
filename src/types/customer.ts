/**
 * Customer entity como llega del back. Equivale al shape que devuelve
 * `GET /auth/me` y `GET /customers/profile`. Mantenelo alineado con
 * `backend/docs/modules/customers.md` cuando agreguen campos.
 */
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  isActive: boolean;
  googleId: string | null;
  createdAt: string;
  updatedAt: string;
}
