// @ts-check
import { defineConfig } from 'astro/config';

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import remarkDoubleSpaceSentences from './src/remark-plugins/double-space-sentences.js';

// https://astro.build/config
export default defineConfig({
  site: 'https://allaboutastro.com',
  integrations: [mdx(), sitemap()],
  markdown: {
    remarkPlugins: [remarkDoubleSpaceSentences],
  },
  // Redirects from the old Weebly .html URLs to the new clean paths.
  redirects: {
    '/blog.html': '/blog/',
    '/astro-gallery.html': '/gallery/',
    '/astro-gear.html': '/gear/',
    '/software-bisque-mounts.html': '/gear/software-bisque-mounts/',
    '/learning.html': '/learning/',
    '/about-me.html': '/about-me/',
    '/sliderules.html': '/sliderules/',
  },
});