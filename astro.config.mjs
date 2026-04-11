import { defineConfig } from 'astro/config';
import solidJs from '@astrojs/solid-js';
import mdx from '@astrojs/mdx';
import vercel from '@astrojs/vercel';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

export default defineConfig({
  output: 'static',
  adapter: vercel(),
  integrations: [solidJs(), mdx()],
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
  },
});
