# Next.js to Astro Migration Design

## Goal

Migrate the existing Next.js 14 blog/portfolio to Astro with SolidJS islands for interactive components. The result should ship zero JS for static pages and minimal JS only where interactivity is required.

## Current State

- Next.js 14.2.3 with React 18, fully static (SSG)
- 8 blog posts and 1 project page as Markdown with YAML frontmatter
- MDX rendering via `next-mdx-remote` + `gray-matter`
- Custom syntax highlighting (Prism) and LaTeX rendering (KaTeX) in a highlight component
- 4 interactive React components: Scheme interpreter (WASM), gossip protocol visualizer, vector clock demo, Berkeley clock sync
- Styled-JSX + global CSS, no CSS framework
- Simple Analytics for tracking
- `react-graph-vis` wrapping `vis-network` for the gossip graph
- `immer` for immutable state in vclock component
- `react-hook-form` for form handling in gossip component

## Architecture

### Content Collections

Blog posts and projects move from `pages/blog/*.md` and `pages/projects/*.md` to `src/content/blog/` and `src/content/projects/`.

Schema defined in `src/content.config.ts`:

```ts
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    path: z.string(),
    description: z.string().optional(),
    date: z.string().optional(),
  }),
});

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    path: z.string(),
    description: z.string().optional(),
    date: z.string().optional(),
  }),
});

export const collections = { blog, projects };
```

Posts currently use a `path` frontmatter field for URL slugs. Dynamic route pages will read this field and map it to the URL via `getStaticPaths()`.

### Directory Structure

```
src/
├── content/
│   ├── content.config.ts
│   ├── blog/              (8 markdown posts, moved from pages/blog/)
│   └── projects/          (project markdown, moved from pages/projects/)
├── layouts/
│   └── BaseLayout.astro   (HTML shell, global CSS, Simple Analytics)
├── components/
│   ├── Nav.astro          (static navigation)
│   ├── Back.astro         (static back button)
│   ├── Interpreter.tsx    (SolidJS - Scheme REPL, WASM)
│   ├── Gossip.tsx         (SolidJS - gossip protocol, vis-network)
│   ├── VClock.tsx         (SolidJS - vector clock demo)
│   └── clock/
│       ├── Clock.tsx      (SolidJS - Berkeley clock sync)
│       └── Berkeley.tsx   (SolidJS - clock sub-component)
├── pages/
│   ├── index.astro        (home page)
│   ├── blog/
│   │   ├── index.astro    (blog listing)
│   │   └── [...slug].astro (individual post)
│   └── projects/
│       ├── index.astro    (projects listing)
│       └── [...slug].astro (individual project)
└── styles.css             (global styles, unchanged)
public/
├── ischeme-wasm.js        (unchanged)
├── ischeme-wasm.wasm      (unchanged)
├── favicon.ico            (unchanged)
└── keybase.txt            (unchanged)
```

### Layout

Single `BaseLayout.astro` containing:
- `<html>`, `<head>`, `<body>` tags
- Global CSS import (`styles.css`)
- Simple Analytics `<script>` tag (from current `_document.js`)
- DNS prefetch for `wiki.isub.dev`
- Props: `title`, `description` for per-page `<head>` metadata
- `<slot />` for page content

### Static Components

**Nav.astro** — Converted from `components/nav.js`. Pure HTML/CSS, no JS. Links: Home, Blog, Projects, Wiki.

**Back.astro** — Converted from `components/back.js`. Pure HTML link.

Styled-jsx blocks in these components convert to Astro scoped `<style>` tags.

### Interactive SolidJS Islands

All interactive components use `client:load` directive in Astro pages.

**Interpreter.tsx**
- Wraps WASM Scheme interpreter
- `createSignal` replaces `useState`
- Loads `/ischeme-wasm.js` from public

**Gossip.tsx**
- Replace `react-graph-vis` with direct `vis-network` usage
- Replace `react-hook-form` with plain form event handlers
- `createSignal` for nodes/edges state
- `useInterval` from `react-use` replaced with `setInterval` in `onMount`/`onCleanup`

**VClock.tsx**
- Replace `immer` + `useState` with SolidJS `createStore`
- Tables and buttons, straightforward port
- Custom `useVClock` hook becomes a SolidJS reactive function

**Clock.tsx + Berkeley.tsx**
- Port reducer pattern to SolidJS `createStore`
- Keep component split (Clock + Berkeley sub-component)

### Markdown Processing

- `@astrojs/mdx` integration for MDX support
- `remark-math` + `rehype-katex` plugins replace the custom KaTeX rendering in `highlight.js`
- Astro's built-in Shiki for syntax highlighting (supports all languages the blog uses: scheme, rust, haskell, c++, assembly)
- Custom MDX components passed via Astro's component overrides where needed

### Pages

**Home (`index.astro`):**
- Static content listing languages, skills, interests
- Converted from JSX to Astro template syntax

**Blog listing (`blog/index.astro`):**
- Uses `getCollection('blog')` to query all posts
- Renders list with title, description, date
- Links use frontmatter `path` field

**Blog post (`blog/[...slug].astro`):**
- `getStaticPaths()` maps frontmatter `path` to URL slugs
- Renders post content with `<Content />` component
- Interactive components available as MDX imports where used

**Projects listing and detail:** Same pattern as blog.

### Configuration

**`astro.config.mjs`:**
```js
import { defineConfig } from 'astro/config';
import solidJs from '@astrojs/solid-js';
import mdx from '@astrojs/mdx';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

export default defineConfig({
  integrations: [solidJs(), mdx()],
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
  },
});
```

### Dependencies

**Remove:**
- `next`, `react`, `react-dom`
- `next-mdx-remote`, `gray-matter`
- `react-graph-vis`, `react-digraph`, `react-hook-form`, `react-use`
- `immer`, `xactor`, `pubsub-js`
- `prism-react-renderer` (Astro handles highlighting)

**Add:**
- `astro`, `@astrojs/solid-js`, `@astrojs/mdx`
- `solid-js`
- `vis-network`, `vis-data`
- `remark-math`, `rehype-katex`, `katex` (keep katex for CSS)

**Keep:**
- `typescript`
- `prismjs` (only if Shiki doesn't cover a language; likely can drop)
- `mnemonist` (only if used in SolidJS components; likely can drop)

### Files Deleted After Migration

- `pages/` directory (entire Next.js pages tree)
- `components/` directory (old React components)
- `helpers/` directory (file utilities, unused raft skeleton)
- `next.config.js`
- `PostCreator.hs` (appears unused)

### Files Unchanged

- `public/` directory (same convention in Astro)
- `tsconfig.json` (minor adjustments for Astro)
- Markdown content (moved, not rewritten)

## Non-Goals

- No CSS framework introduction (keep global CSS + scoped styles)
- No SSR — static output only
- No new features — 1:1 feature parity with current site
- No content changes
