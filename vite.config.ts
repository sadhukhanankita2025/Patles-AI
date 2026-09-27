import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, '.'),
    },
  },
  server: {
    hmr: false,
    watch: process.env.DISABLE_HMR === 'true' ? null : {},
  },
  build: {
    chunkSizeWarningLimit: 600,
  },
});
