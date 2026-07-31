// @ts-check
import { defineConfig } from 'astro/config';

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import remarkDoubleSpaceSentences from './src/remark-plugins/double-space-sentences.js';

// Restored old-site pages that are built and deployed (reachable by direct
// URL) but intentionally unlinked from nav/indexes and excluded here from
// the sitemap — see each page's own `unlisted: true` frontmatter / noindex
// meta tag for the matching half of this.
const UNLISTED_PATHS = [
  '/unlisted/',
  '/downloads/',
  '/tutorials-oldpage/',
  '/learning/general-astronomy/',
  '/learning/cosmic-perspectives/',
  '/learning/philosophytheory/',
  '/learning/how-to-choose-a-refractor/',
  '/learning/building-a-roll-off-roof-observatory/',
  '/learning/best-outreach-telescope-setup/',
  '/learning/celestron/',
  '/learning/astroimaging-keys-to-success/',
  '/learning/ethics-in-astroimaging/',
  '/learning/digital-imaging-101/',
  '/learning/processing-practices/',
  '/learning/workflow-tips-and-tricks/',
  '/learning/acquisition-practices/',
  '/learning/how-to-calibrate-your-data/',
  '/learning/improving-images-by-fighting-noise/',
  '/learning/rethinking-image-sampling/',
  '/learning/exploring-color-saturation/',
  '/learning/the-future-of-imagingtoday/',
  '/learning/how-to-buy-an-astro-camera/',
  '/learning/astro-ccds-vs-dslrs/',
  '/learning/dslrs-and-unity-gain/',
  '/learning/the-focal-ratio-myth/',
  '/learning/the-inverse-relationship-of-field-of-view-and-resolution/',
  '/learning/how-to-be-a-good-math-teacher/',
  '/sliderules/itty-bitty-rules/',
  '/unlisted/astrometric-tool/',
];

// https://astro.build/config
export default defineConfig({
  site: 'https://allaboutastro.com',
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => !UNLISTED_PATHS.some((path) => page.endsWith(path)),
    }),
  ],
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