import { defineConfig } from 'vite'; // eslint-disable-line import/no-unresolved
import { patchCssModules } from 'vite-css-modules';
import react, { reactCompilerPreset } from '@vitejs/plugin-react'; // eslint-disable-line import/no-unresolved
import babel from '@rolldown/plugin-babel'; // eslint-disable-line import/no-unresolved

export default defineConfig({
  clearScreen: false,
  plugins: [
    patchCssModules(),
    react(),
    babel({ presets: [reactCompilerPreset()] }),
  ],
  server: {
    allowedHosts: true, // Fully static site, no risk due to cross-site scripting
  },
});
