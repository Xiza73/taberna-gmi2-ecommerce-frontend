/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_GOOGLE_CLIENT_ID?: string;
  readonly VITE_MP_PUBLIC_KEY?: string;
  /** Datos del negocio para pagos manuales y pickup. */
  readonly VITE_YAPE_NUMBER?: string;
  readonly VITE_BANK_NAME?: string;
  readonly VITE_BANK_ACCOUNT?: string;
  readonly VITE_BANK_CCI?: string;
  readonly VITE_BANK_HOLDER?: string;
  /** Formato internacional sin `+`, ej `51999999999`. */
  readonly VITE_WHATSAPP_NUMBER?: string;
  /** Texto multi-line; usar `\n` para line breaks. */
  readonly VITE_PICKUP_ADDRESS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
