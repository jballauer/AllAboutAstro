import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string().optional(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    coverImage: image().optional(),
    draft: z.boolean().default(false),
  }),
});

const learning = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/learning' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string().optional(),
    order: z.number().default(0),
    coverImage: image().optional(),
    draft: z.boolean().default(false),
    // Built and deployed, but excluded from the /learning/ index, nav, and
    // sitemap, and rendered with a noindex meta tag — reachable only by
    // direct URL. For old-site pages restored as unlisted drafts/holding
    // pages, distinct from `draft` (which drops the page from the build
    // entirely outside local dev).
    unlisted: z.boolean().default(false),
  }),
});

const gear = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/gear' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    // Optional override for the on-page <h1> when the article's own title
    // (as the source page wrote it) differs from the short nav-friendly
    // `title` used in the Gear dropdown and breadcrumbs.
    heading: z.string().optional(),
    description: z.string().optional(),
    order: z.number().default(0),
    coverImage: image().optional(),
    draft: z.boolean().default(false),
  }),
});

const sliderules = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/sliderules' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string().optional(),
    order: z.number().default(0),
    coverImage: image().optional(),
    draft: z.boolean().default(false),
    unlisted: z.boolean().default(false),
  }),
});

const gallery = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/gallery' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string().optional(),
    pubDate: z.coerce.date(),
    image: image().optional(),
    // Custom-cropped alternate for the /gallery/ grid tile, when the default
    // centered/gravity-based auto-crop of `image` doesn't frame the subject
    // well (e.g. two widely separated galaxies). Falls back to `image`.
    thumbnailImage: image().optional(),
    equipment: z.string().optional(),
    exposure: z.string().optional(),
    draft: z.boolean().default(false),
    // Earlier/lesser imaging attempts that Jay wants a real page for (so they
    // can be linked from the object's main gallery entry) but not thumbnailed
    // in the main /gallery/ grid alongside his preferred images of an object.
    showInGallery: z.boolean().default(true),
  }),
});

export const collections = { blog, learning, gear, sliderules, gallery };
