import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/', // Ensures Vite knows how to resolve static assets
  build: {
    outDir: 'dist', // Vite output directory, ensure it's named 'dist'
  },
});
