# Native Wiki Design

**Date:** 2026-05-11
**Status:** Draft — awaiting user review

## Goal

Replace the externally-hosted GitBook wiki (`https://isubasinghe.gitbook.io/isithas-wiki`) with a wiki built directly into this Astro site, served from `/wiki`. The wiki holds nested markdown files, supports `[[slug]]` cross-links with backlinks, and ships a graph view of the link structure.

## Non-goals

- Porting the GitBook `?ask=<question>` agent endpoint. The site stays fully static.
- Authoring wiki content. The user writes their own pages; this design only delivers the scaffolding.
- Full-text search. Not requested; can be added later if needed.
- A persistent collapsible sidebar (rejected during brainstorm — minimal chrome preferred).

## Decisions made during brainstorm

| Question | Choice |
|---|---|
| Navigation style | Breadcrumbs at top + sibling list at bottom of each page. No persistent sidebar. |
| Linking model | `[[slug]]` wiki-links + backlinks panel + graph view (using `vis-network`, already in deps). |
| Agent `?ask=` endpoint | Dropped. Fully static build. |
| URL & wiki-link IDs | File path under `src/content/wiki/` is the URL. `[[slug]]` resolves by filename. |
| Implementation strategy | Custom remark plugin + `getCollection`-based graph helper. No separate Astro integration. |

## Architecture

### Directory layout

```
src/content/wiki/
  index.md                          → /wiki
  concurrency/
    index.md                        → /wiki/concurrency
    atomic-ops.md                   → /wiki/concurrency/atomic-ops
    mesi.md                         → /wiki/concurrency/mesi
  distributed-systems/
    index.md                        → /wiki/distributed-systems
    gossip.md                       → /wiki/distributed-systems/gossip
```

A wiki page's URL is its file path under `src/content/wiki/` with `.md`/`.mdx` stripped and `/index` collapsed. Astro's glob loader gives us entry `id`s like `concurrency/atomic-ops` and `concurrency/index` (it does *not* collapse `/index` for us); the URL-collapse rule lives in a small `entryToUrl(id)` helper in `src/lib/wiki/graph.ts` used by every consumer (remark plugin map, `getStaticPaths`, breadcrumbs, sibling list, graph nodes).

**Index entry routing**:
- `wiki/index.md` (id `"index"`) → rendered by the static `src/pages/wiki/index.astro` page, which calls `getEntry('wiki', 'index')` for the body. `[...slug].astro` filters out the entry with id `"index"` so it doesn't double-route.
- `wiki/concurrency/index.md` (id `"concurrency/index"`) → routed by `[...slug].astro` with `params.slug = "concurrency"` (the `/index` suffix collapsed by `entryToUrl`).

### Content collection

Added to `src/content.config.ts` alongside `blog` and `projects`. Schema differs from blog/projects: **no `path` field** (URL derives from file location), plus optional `tags`.

```ts
const wiki = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/wiki' }),
  schema: z.object({
    title: z.string(),
    description: z.string().nullable().optional().default('').transform(v => v ?? ''),
    tags: z.array(z.string()).optional().default([]),
  }),
});
```

### Routes

| Route | File | Purpose |
|---|---|---|
| `/wiki` | `src/pages/wiki/index.astro` | Renders `wiki/index.md` body + lists top-level child pages |
| `/wiki/[...slug]` | `src/pages/wiki/[...slug].astro` | Every other wiki page: content + breadcrumbs + siblings + backlinks |
| `/wiki/graph` | `src/pages/wiki/graph.astro` | Full link graph rendered by `vis-network` |

### Site-wide changes

- `src/components/Nav.astro`: replace the external GitBook link (`https://isubasinghe.gitbook.io/isithas-wiki/`) with internal `/wiki`.
- `src/layouts/BaseLayout.astro`: remove the `dns-prefetch` hint for `wiki.isub.dev`.

## Components

### `src/lib/wiki/remark-wiki-link.ts` (~80 LOC)

Custom unified/remark plugin. Lazy filesystem scan on first invocation builds `Map<slug, { url, title }>` cached in module scope (one scan per `astro build`). Uses `fast-glob` + `gray-matter` to walk `src/content/wiki/` directly — Astro doesn't expose its content collection to plugin-init time.

Behaviour:
- Visits MDAST `text` nodes; regex matches `[[slug]]` or `[[slug|display text]]`.
- Splits each match into `text + link + text` runs in the parent's children array.
- Unknown slug → emits `vfile.message(...)` warning and produces a `<span class="wiki-link broken">` instead of a link.
- `code` and `inlineCode` MDAST nodes are skipped naturally (the visitor only descends into `text`).
- Ambiguous basenames (two files with the same basename in different folders) throw at plugin-init with both file paths in the message — this is a build-time hard failure.

### `src/lib/wiki/graph.ts` (~60 LOC)

Pure functions operating on `getCollection('wiki')` output. No filesystem access; uses the same regex as the remark plugin to extract link references from entry bodies.

```ts
export function entryToUrl(id: string): string;          // "concurrency/index" → "/wiki/concurrency"
export function buildLinkIndex(entries: CollectionEntry<'wiki'>[]): LinkIndex;
export function backlinksFor(slug: string, index: LinkIndex): CollectionEntry<'wiki'>[];
export function graphData(entries: CollectionEntry<'wiki'>[], index: LinkIndex): { nodes, edges };
```

`entryToUrl` is shared between the remark plugin (when building its slug→url map) and the page routes/components. Single source of truth for the collapse rule.

`LinkIndex` is `{ outgoing: Map<string, Set<string>>, incoming: Map<string, Set<string>> }`. `backlinksFor` excludes self-links and sorts by title. `graphData` shapes data for `vis-network`.

### `src/components/wiki/Breadcrumbs.astro` (~25 LOC)

Renders `Home › Wiki › concurrency › atomic-ops` for a given slug. Each segment links to that level's index page if one exists, otherwise renders as plain text.

### `src/components/wiki/SiblingList.astro` (~25 LOC)

Lists every wiki entry sharing the same parent path as the given slug. Used at the bottom of `[...slug].astro`. The "parent listing" half of the navigation choice.

### `src/components/wiki/Backlinks.astro` (~20 LOC)

Renders a `<section>` titled "Linked from" listing entries that reference this page. Hidden when empty.

### `src/components/wiki/Graph.tsx` (Solid, ~60 LOC)

Wraps `vis-network`. Receives `{ nodes, edges }` as a prop. Clicking a node navigates to that wiki page. Used only on `/wiki/graph` and loaded with `client:only="solid-js"` so `vis-network` never executes at SSG time.

## Data flow

```
src/content/wiki/concurrency/atomic-ops.md
      │
      ▼
[Astro content loader]    glob: **/*.{md,mdx}
      │  → entry { id: "concurrency/atomic-ops", body, data }
      ▼
[remark pipeline]
   ├─ remark-math               (existing)
   ├─ remark-wiki-link          (NEW)
   │     • first call: scan src/content/wiki, build slug map, cache
   │     • visit text nodes; rewrite [[slug]] → link MDAST node
   │     • unknown slug → vfile warning + broken-link span
   └─ rehype-katex              (existing)
      │
      ▼
src/pages/wiki/[...slug].astro
   getStaticPaths():
     entries = await getCollection('wiki')
     index   = buildLinkIndex(entries)
     return entries
       .filter(e => e.id !== 'index')                     // root index handled by index.astro
       .map(e => ({
         params: { slug: entryToUrl(e.id).replace(/^\/wiki\//, '') },
         props:  { entry: e, backlinks: backlinksFor(e.id, index) }
       }))

   render():
     <Breadcrumbs slug={entry.id} />
     <Content />                              ← body with rewritten links
     <SiblingList slug={entry.id} />
     <Backlinks entries={backlinks} />
```

The graph page does the same `buildLinkIndex` call, then `graphData(entries, index)`, and passes the result into `<Graph client:only="solid-js" />`.

### The two slug indexes

The remark plugin builds its slug→url map by walking the filesystem directly because remark plugins are configured at `astro.config.mjs` evaluation time, before Astro's content layer exists. `graph.ts` builds its link index from `getCollection()` results inside page scripts. Both derive from the same folder, so they stay consistent by construction.

If `astro dev` cache staleness becomes annoying (new wiki file not picked up until server restart), we promote to a manifest-emitting Astro integration without changing any markdown.

## Error handling

| Case | Behaviour | Where |
|---|---|---|
| Unknown `[[slug]]` | `vfile.message` warning with file:line:col; renders `<span class="wiki-link broken">` with CSS dotted red underline. Build succeeds. | remark plugin |
| Ambiguous basename (same name in two folders) | Throws at plugin-init with both file paths in the error. Build fails. | remark plugin |
| Malformed frontmatter | Zod schema error pointing at the file. Build fails. | content config |
| `[[slug]]` inside a code fence or inline code | Left untouched (MDAST visitor only descends `text` nodes). | remark plugin (structural) |
| `[[slug\|display]]` aliasing | Supported from the start; one regex covers both forms. | remark plugin |
| Self-link `[[atomic-ops]]` on the atomic-ops page | Renders as a normal link. Backlinks index excludes it. | graph.ts |
| Empty wiki folder | `SiblingList`/`Backlinks` render nothing; graph page shows single node. | components |
| Wiki page with no body | Renders title + chrome only. | components |

## Testing

The project has no test runner today. Add **`vitest`** (devDependency) and a `"test": "vitest run"` script. Coverage scoped to pure logic only.

### `src/lib/wiki/remark-wiki-link.test.ts`

- `[[atomic-ops]]` in a paragraph → MDAST link node with correct href
- `[[atomic-ops|atomic operations]]` → link node with display text
- Unknown slug → broken-link span + vfile warning recorded
- `[[foo]]` inside an inline-code or fenced-code block → left untouched
- Two `[[...]]` in one paragraph → both rewritten, surrounding text preserved
- Slug map built from a fixture folder under `test/fixtures/wiki/`
- Ambiguous basename in fixture (same name in two folders) → plugin init throws with both paths in the message

### `src/lib/wiki/graph.test.ts`

- `entryToUrl("concurrency/atomic-ops")` → `/wiki/concurrency/atomic-ops`
- `entryToUrl("concurrency/index")` → `/wiki/concurrency`
- `entryToUrl("index")` → `/wiki`
- `buildLinkIndex` over a 4-page fixture: outgoing/incoming maps match expected
- `backlinksFor` excludes self-links, sorts by title
- `graphData` produces correctly shaped nodes/edges for `vis-network`

### Deliberately not tested

- `.astro` components — Astro lacks a first-class component test runner; covered by build success + manual smoke check.
- `Graph.tsx` — `vis-network` is hard to test headlessly; thin wrapper. Manual check.

### Smoke checks (run during the implementation plan)

- `yarn build` succeeds with zero unknown-link warnings on a seeded fixture wiki page
- `yarn dev` — manually click through 3 wiki pages, follow a `[[link]]`, see breadcrumbs/siblings/backlinks render, load `/wiki/graph` and click a node

### TDD note

Per the `test-driven-development` skill, `remark-wiki-link.ts` and `graph.ts` are built test-first. Page components are scaffolding — built after, smoke-verified.

## File-change summary

**New**:
- `src/content/wiki/` (folder, with at minimum a seeded `index.md` for the build to have something to render)
- `src/content/wiki/index.md` (minimal placeholder; user fills in)
- `src/lib/wiki/remark-wiki-link.ts`
- `src/lib/wiki/graph.ts`
- `src/lib/wiki/remark-wiki-link.test.ts`
- `src/lib/wiki/graph.test.ts`
- `src/components/wiki/Breadcrumbs.astro`
- `src/components/wiki/SiblingList.astro`
- `src/components/wiki/Backlinks.astro`
- `src/components/wiki/Graph.tsx`
- `src/pages/wiki/index.astro`
- `src/pages/wiki/[...slug].astro`
- `src/pages/wiki/graph.astro`
- `test/fixtures/wiki/` (small fixture set for unit tests)
- `vitest.config.ts`

**Edited**:
- `src/content.config.ts` — add `wiki` collection
- `astro.config.mjs` — append `remarkWikiLink` to `markdown.remarkPlugins`
- `src/components/Nav.astro` — swap external GitBook link for `/wiki`
- `src/layouts/BaseLayout.astro` — drop `dns-prefetch` for `wiki.isub.dev`
- `package.json` — add `vitest`, `fast-glob`, `gray-matter` devDependencies; add `"test"` script
- `src/styles.css` — add `.wiki-link.broken` style (dotted red underline)

## Out of scope (future work, not part of this design)

- Full-text search across the wiki
- Tag index pages (`tags` field is captured but not yet rendered)
- Per-page table of contents
- Switching to manifest-based Astro integration (Approach B from brainstorm) if dev-server staleness becomes a real problem
