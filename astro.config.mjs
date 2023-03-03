import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import svelte from "@astrojs/svelte";
import tailwind from "@astrojs/tailwind";
import { loadEnv } from 'vite';


const env = loadEnv("", process.cwd(), 'STORYBLOK');


// https://astro.build/config
export default defineConfig({
  // Enable React to support React JSX, Tailwind, Svelte, etc. etc. components.
  integrations: [react(), tailwind(), svelte()],

});