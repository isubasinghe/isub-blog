// remark-wiki-link: rewrites `[[slug]]` and `[[slug|display]]` in markdown
// text nodes into proper link nodes that point at /wiki/<...>.
//
// The plugin walks the configured `base` directory once on first use, builds
// a Map<basenameSlug, { url, title }>, and caches it in module scope. Unknown
// slugs become a broken-link span and emit a vfile message. Ambiguous
// basenames (same file name in two folders) throw at scan time — that's a
// real authoring bug and should fail the build.

import fg from 'fast-glob';
import matter from 'gray-matter';
import path from 'node:path';
import { readFileSync } from 'node:fs';
import { visit, SKIP } from 'unist-util-visit';
import type { Plugin } from 'unified';
import type { Root, Text, PhrasingContent, Parent } from 'mdast';
import { entryToUrl } from './graph';

export interface RemarkWikiLinkOptions {
  /** Absolute path to the directory holding wiki markdown files. */
  base: string;
}

interface SlugEntry {
  url: string;
  title: string;
}

let _cache: Map<string, SlugEntry> | null = null;
let _cacheBase: string | null = null;

/** Test-only: clear the module-level cache so fixtures can be swapped. */
export function _resetCacheForTests(): void {
  _cache = null;
  _cacheBase = null;
}

function entryIdFromFile(file: string, base: string): string {
  const rel = path.relative(base, file);
  // strip .md / .mdx
  return rel.replace(/\.mdx?$/, '');
}

function slugFromEntryId(id: string): string {
  // The basename of the entry. For folder index pages (e.g. "concurrency/index"
  // or "physics/README"), the slug is the parent folder name so they're
  // linkable as [[concurrency]] / [[physics]]. For everything else it's the
  // last path segment.
  if (id === 'index') return 'index';
  if (id === 'README') return 'README';
  if (id.endsWith('/index')) {
    return path.basename(id.slice(0, -'/index'.length));
  }
  if (id.endsWith('/README')) {
    return path.basename(id.slice(0, -'/README'.length));
  }
  return path.basename(id);
}

function isFolderIndexId(id: string): boolean {
  return id === 'index' || id === 'README' ||
    id.endsWith('/index') || id.endsWith('/README');
}

function buildSlugMap(base: string): Map<string, SlugEntry> {
  const files = fg.sync(['**/*.md', '**/*.mdx'], { cwd: base, absolute: true });
  const map = new Map<string, SlugEntry>();
  // Track which file currently owns each bare basename so we can decide
  // collisions: folder index pages (README / index.md) win over leaves;
  // between two leaves we keep the first and warn (the user can
  // disambiguate by writing [[folder/leaf]] — every entry is also
  // registered under its full path id below).
  const basenameOwner = new Map<string, { file: string; id: string }>();

  for (const file of files) {
    const id = entryIdFromFile(file, base);
    const slug = slugFromEntryId(id);
    const url = entryToUrl(id);

    const raw = readFileSync(file, 'utf8');
    const { data } = matter(raw);
    const title = typeof data.title === 'string' && data.title.length > 0
      ? data.title
      : slug;
    const entry: SlugEntry = { url, title };

    // Bare basename slot — folder-index wins, leaf-vs-leaf keeps first.
    const previous = basenameOwner.get(slug);
    if (!previous || previous.file === file) {
      basenameOwner.set(slug, { file, id });
      map.set(slug, entry);
    } else {
      const previousIsFolder = isFolderIndexId(previous.id);
      const currentIsFolder = isFolderIndexId(id);
      if (previousIsFolder && !currentIsFolder) {
        // keep folder index; ignore leaf
      } else if (!previousIsFolder && currentIsFolder) {
        basenameOwner.set(slug, { file, id });
        map.set(slug, entry);
      } else {
        console.warn(
          `[wiki] ambiguous basename "[[${slug}]]": keeping ${previous.file}, ignoring ${file}. ` +
          `Use [[<folder>/${slug}]] to disambiguate.`,
        );
      }
    }

    // Always register the full-path id (e.g. "math/calculus/basics") so
    // disambiguated wiki-links work regardless of basename collisions.
    map.set(id, entry);
    // For folder index pages, also register the folder path itself
    // (e.g. "math/calculus" → the README.md). entryToUrl already collapses
    // /index and /README, so this is purely a slug-map alias.
    if (isFolderIndexId(id) && id !== 'index' && id !== 'README') {
      const folderPath = id.replace(/\/(index|README)$/, '');
      // Don't clobber a real entry that happens to live at that path.
      if (!map.has(folderPath)) map.set(folderPath, entry);
    }
  }

  return map;
}

function getSlugMap(base: string): Map<string, SlugEntry> {
  if (_cache && _cacheBase === base) return _cache;
  _cache = buildSlugMap(base);
  _cacheBase = base;
  return _cache;
}

// Match [[slug]] or [[slug|display text]]. We capture three groups so we
// can preserve the user's display override when present.
const WIKI_LINK_RE = /\[\[([A-Za-z0-9_\-/]+)(?:\|([^\]]+))?\]\]/g;

export const remarkWikiLink: Plugin<[RemarkWikiLinkOptions], Root> = (options) => {
  const base = options?.base;
  if (!base) throw new Error('remark-wiki-link: options.base is required');

  return (tree, file) => {
    const slugMap = getSlugMap(base);

    visit(tree, 'text', (node: Text, index, parent: Parent | undefined) => {
      if (!parent || typeof index !== 'number') return;
      if (parent.type === 'inlineCode' || parent.type === 'code') return;

      const value = node.value;
      WIKI_LINK_RE.lastIndex = 0;
      if (!WIKI_LINK_RE.test(value)) return;

      // Build replacement children by walking the matches sequentially.
      const replacement: PhrasingContent[] = [];
      let cursor = 0;
      WIKI_LINK_RE.lastIndex = 0;
      for (const match of value.matchAll(WIKI_LINK_RE)) {
        const start = match.index ?? 0;
        const end = start + match[0].length;
        const slug = match[1];
        const display = match[2];

        if (start > cursor) {
          replacement.push({ type: 'text', value: value.slice(cursor, start) });
        }

        const target = slugMap.get(slug);
        if (target) {
          replacement.push({
            type: 'link',
            url: target.url,
            children: [{ type: 'text', value: display ?? target.title }],
          });
        } else {
          file.message(
            `unknown wiki-link "[[${slug}]]"`,
            node,
            'remark-wiki-link:unknown-slug',
          );
          replacement.push({
            type: 'html',
            value: `<span class="wiki-link broken" title="unknown wiki-link: ${slug}">${display ?? slug}</span>`,
          });
        }

        cursor = end;
      }

      if (cursor < value.length) {
        replacement.push({ type: 'text', value: value.slice(cursor) });
      }

      parent.children.splice(index, 1, ...replacement);
      // Skip the children we just inserted to avoid re-visiting.
      return [SKIP, index + replacement.length];
    });
  };
};

export default remarkWikiLink;
