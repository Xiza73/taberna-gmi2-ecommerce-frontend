import { create } from 'zustand';

interface CartUiState {
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  setDrawerOpen: (open: boolean) => void;
}

/**
 * Estado UI del cart drawer. NO se persiste — el drawer arranca cerrado en
 * cada navegación inicial.
 */
export const useCartUiStore = create<CartUiState>((set) => ({
  isDrawerOpen: false,
  openDrawer: () => set({ isDrawerOpen: true }),
  closeDrawer: () => set({ isDrawerOpen: false }),
  setDrawerOpen: (open) => set({ isDrawerOpen: open }),
}));
