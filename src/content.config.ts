import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    path: z.string(),
    description: z.string().nullable().optional().default('').transform(v => v ?? ''),
    date: z.string().nullable().optional().default(null),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    path: z.string(),
    description: z.string().nullable().optional().default('').transform(v => v ?? ''),
    date: z.string().nullable().optional().default(null),
  }),
});

const wiki = defineCollection({
  loader: glob({
    pattern: [
      '**/*.{md,mdx}',
      // Knowledge-submodule cruft we don't publish.
      '!.gitbook/**',
      '!_layouts/**',
      '!_config.yml',
      '!assets/**',
      '!logseq/**',
      '!journals/**',
      '!pages/**',
      '!SUMMARY.md',
      '!.vscode/**',
    ],
    base: './src/content/wiki',
  }),
  schema: z.object({
    title: z.string().optional(),
    description: z.string().nullable().optional().default('').transform(v => v ?? ''),
    tags: z.array(z.string()).optional().default([]),
  }),
});

export const collections = { blog, projects, wiki };
