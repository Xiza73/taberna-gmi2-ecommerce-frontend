import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    // Convención de puertos del workspace (definida en `backend/.env`):
    //   5173 = ecommerce  (este front)
    //   5174 = backoffice
    //   5175 = pos (futuro)
    // El back arma los links de email (`ECOMMERCE_URL`) asumiendo 5173,
    // así que dejamos `strictPort: true` para no caer a otro puerto.
    port: 5173,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});
