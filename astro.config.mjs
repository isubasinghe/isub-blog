import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';
import solidJs from '@astrojs/solid-js';
import mdx from '@astrojs/mdx';
import vercel from '@astrojs/vercel';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { remarkWikiLink } from './src/lib/wiki/remark-wiki-link.ts';
import { remarkStripLeadingH1 } from './src/lib/wiki/remark-strip-leading-h1.ts';

const wikiBase = fileURLToPath(new URL('./src/content/wiki', import.meta.url));

export default defineConfig({
  output: 'static',
  adapter: vercel(),
  integrations: [solidJs(), mdx()],
  markdown: {
    remarkPlugins: [
      remarkMath,
      [remarkWikiLink, { base: wikiBase }],
      // Wiki pages always render a derived H1 in the layout — drop the
      // body's leading H1 so we don't duplicate it. Scoped to wiki files
      // only; blog posts are unaffected.
      remarkStripLeadingH1,
    ],
    rehypePlugins: [rehypeKatex],
  },
});
