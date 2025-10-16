import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/accounts': {
        target: 'http://localhost:3000',
        changeOrigin: true
      },
      '/transactions': {
        target: 'http://localhost:3000',
        changeOrigin: true
      },
      '/login': {
        target: 'http://localhost:3000',
        changeOrigin: true
      },
      '/logout': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  }
});
