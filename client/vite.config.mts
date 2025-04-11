import { defineConfig } from 'vite';
import { patchCssModules } from 'vite-css-modules';
import react from '@vitejs/plugin-react';

export default defineConfig({
  clearScreen: false,
  plugins: [
    patchCssModules(),
    react({
      babel: {
        plugins: ['react-compiler'],
      },
    }),
  ],
  server: {
    allowedHosts: true, // Fully static site, no risk due to cross-site scripting
  },
});
