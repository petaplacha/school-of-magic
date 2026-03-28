import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/school-of-magic-git/', // Důležité pro správné načítání na GitHub Pages
  build: {
    outDir: 'docs', // Výstupní složka pro GitHub Pages
  },
});
