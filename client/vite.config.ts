// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',  // Ensure the output directory matches your Vercel config
  },
  server: {
    port: 3000,  // Optional: Customize local dev server port
  },
  preview: {
    port: 4173,  // Optional: Customize preview port
  },
});
