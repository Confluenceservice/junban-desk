import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Forge Custom UI runs in a sandboxed iframe served from Atlassian's CDN.
// Assets must use relative paths, so `base` is set to an empty string.
export default defineConfig({
  plugins: [react()],
  base: '',
  build: {
    outDir: 'dist',
  },
});
