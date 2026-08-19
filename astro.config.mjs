// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import netlify from '@astrojs/netlify';
import keystatic from '@keystatic/astro';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://offlinechildhood.com',
  output: 'static',
  adapter: netlify(),
  integrations: [react(), mdx(), sitemap(), keystatic()],
  vite: {
    plugins: [tailwindcss()],
  },
});
