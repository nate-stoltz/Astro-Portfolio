import { defineConfig } from 'astro/config';
import glsl from 'vite-plugin-glsl';

export default defineConfig({
  site: 'https://nate-stoltz.github.io/Astro-Portfolio',
  base: '/Astro-Portfolio',
  vite: {
    plugins: [glsl()],
  },
  integrations: [],
});
