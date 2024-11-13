import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

export default defineConfig({
  plugins: [react()],
  
  css: {
    postcss: {
      plugins: [tailwindcss(), autoprefixer()],
    },
  },

  server: {
    proxy: {
      '/api': 'http://localhost:4000',
      '/uploads': 'http://localhost:4000'
    }
  }
});