import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@styles': path.resolve(__dirname, 'src/styles'),
    },
  },
});