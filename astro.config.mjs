import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// https://astro.build/config
import tailwind from "@astrojs/tailwind";
import storyblok from "@storyblok/astro";
import { loadEnv } from 'vite';

const env = loadEnv("", process.cwd(), 'STORYBLOK');
// https://astro.build/config
export default defineConfig({
  // Enable React to support React JSX components.
  integrations: [
    react(),
    tailwind(),
    storyblok({
      accessToken: "byTfivyQ4fk1GqLbdcRUBQtt",
      components: {
        // Add your components here
      },
      apiOptions: {
        // Choose your Storyblok space region
        region: 'us', // optional,  or 'eu' (default)

      }

    }),]
});