import { defineConfig } from 'astro/config';
import glsl from 'vite-plugin-glsl';

export default defineConfig({
  site: 'https://natestoltz.com',
  vite: {
    plugins: [glsl()],
  },
  integrations: [],
});
