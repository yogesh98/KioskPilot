import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  esbuild: {
    // Including JS files explicitly for the build
    include: /.*\.(js|jsx)$/,
  },
});