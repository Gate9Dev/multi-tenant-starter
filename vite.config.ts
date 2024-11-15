import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
    exclude: ['@libsql/client']
  },
  build: {
    target: 'esnext',
    rollupOptions: {
      external: ['@libsql/client']
    }
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
});