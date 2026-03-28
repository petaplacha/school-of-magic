import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/school-of-magic/', // Opraveno pro správný název repozitáře na GitHub Pages
  build: {
    outDir: 'docs',
  },
});
