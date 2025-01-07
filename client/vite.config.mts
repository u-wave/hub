import { defineConfig } from 'vite';
import { patchCssModules } from 'vite-css-modules';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    patchCssModules(),
    react({
      babel: {
        plugins: ['react-compiler'],
      },
    }),
  ],
});
