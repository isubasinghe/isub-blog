import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    path: z.string(),
    description: z.string().optional().default(''),
    date: z.string().nullable().optional().default(null),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    path: z.string(),
    description: z.string().optional().default(''),
    date: z.string().nullable().optional().default(null),
  }),
});

export const collections = { blog, projects };
