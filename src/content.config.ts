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
  }),
});

const gear = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/gear' }),
  schema: ({ image }) => z.object({
    title: z.string(),
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
  }),
});

const gallery = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/gallery' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string().optional(),
    pubDate: z.coerce.date(),
    image: image().optional(),
    equipment: z.string().optional(),
    exposure: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog, learning, gear, sliderules, gallery };
