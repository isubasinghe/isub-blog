// Pure functions over the wiki collection. No filesystem access — consumers
// pass in entries fetched via Astro's getCollection('wiki'). Tests use a
// stand-in shape (WikiEntryLike) so this module doesn't depend on Astro's
// content types at test time.

export interface WikiEntryLike {
  id: string;
  body?: string;
  // title is optional — content sourced from external wikis (e.g. the
  // Knowledge submodule) often lacks frontmatter. displayTitle() resolves
  // a label with first-H1 / basename fallbacks.
  data: { title?: string };
}

export interface LinkIndex {
  outgoing: Map<string, Set<string>>;
  incoming: Map<string, Set<string>>;
}

export interface GraphNode {
  id: string;
  label: string;
  url: string;
}

export interface GraphEdge {
  from: string;
  to: string;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

// Case-insensitive: Astro 5's glob loader normalizes entry ids to lowercase,
// so "README.md" comes through as "readme" in Astro consumers — while the
// remark plugin (which walks the filesystem directly) sees "README". One
// regex handles both.
const FOLDER_INDEX_SUFFIX_RE = /\/(?:index|readme)$/i;
const ROOT_INDEX_RE = /^(?:index|readme)$/i;

/**
 * Map a wiki collection entry id to its public URL.
 *   "concurrency/atomic-ops" → "/wiki/concurrency/atomic-ops"
 *   "concurrency/index"      → "/wiki/concurrency"
 *   "concurrency/README"     → "/wiki/concurrency"
 *   "index" | "README"       → "/wiki"
 */
export function entryToUrl(id: string): string {
  if (ROOT_INDEX_RE.test(id)) return '/wiki';
  const m = id.match(FOLDER_INDEX_SUFFIX_RE);
  if (m) return '/wiki/' + id.slice(0, -m[0].length);
  return '/wiki/' + id;
}

/** True if the id is a root or folder index page (index.md or README.md). */
export function isFolderIndexId(id: string): boolean {
  return ROOT_INDEX_RE.test(id) || FOLDER_INDEX_SUFFIX_RE.test(id);
}

function basenameOf(id: string): string {
  const i = id.lastIndexOf('/');
  return i === -1 ? id : id.slice(i + 1);
}

// Decode CommonMark backslash-escapes inside extracted heading text. Without
// this, source markdown like `# computer\_science` (a common GitBook/Jekyll
// convention to keep `_` from triggering italics) would leak the backslash
// into the rendered title.
function decodeMdEscapes(s: string): string {
  return s.replace(/\\([!-/:-@\[-`{-~])/g, '$1');
}

function firstH1(body: string): string | null {
  // Strip frontmatter if present (Astro normally peels it off, but tests
  // may pass raw markdown). Then look for the first ATX H1.
  const stripped = body.replace(/^---\n[\s\S]*?\n---\n?/, '');
  const m = stripped.match(/^#\s+(.+?)\s*$/m);
  return m ? decodeMdEscapes(m[1].trim()) : null;
}

// Turn a slug-style basename into a more readable label. Underscores and
// hyphens become spaces; case is preserved (don't title-case — that would
// mangle acronyms like "ai", "cpu", "flp").
function prettifyBasename(s: string): string {
  return s.replace(/[_-]+/g, ' ').trim();
}

// A heading "looks like a real title" if it has a space (multi-word) or
// mixed case ("FLP Result" but also "iPhone"). A bare slug like
// "data_structures" or "flp" doesn't qualify — treat it as if no H1 were
// present so we fall through to the prettified basename.
function looksLikeTitle(h1: string): boolean {
  if (/\s/.test(h1)) return true;
  return /[A-Z]/.test(h1) && /[a-z]/.test(h1);
}

/**
 * Resolve a display label for an entry: frontmatter title → first markdown
 * H1 (if it reads like a real title) → prettified basename. Root index /
 * README without a title becomes "Wiki"; folder index pages become the
 * folder name.
 */
export function displayTitle<E extends WikiEntryLike>(entry: E): string {
  const t = entry.data.title;
  if (typeof t === 'string' && t.length > 0) return t;

  const h1 = firstH1(entry.body ?? '');
  if (h1 && looksLikeTitle(h1)) return h1;

  if (ROOT_INDEX_RE.test(entry.id)) return 'Wiki';
  const trimmed = entry.id.replace(FOLDER_INDEX_SUFFIX_RE, '');
  return prettifyBasename(basenameOf(trimmed));
}

// Match [[slug]] or [[slug|display text]]. Slug allows letters, digits,
// hyphen, underscore, and forward slash so nested references work later
// even though current consumers only use bare basenames.
const WIKI_LINK_RE = /\[\[([A-Za-z0-9_\-/]+)(?:\|[^\]]+)?\]\]/g;

/**
 * Strip fenced code blocks and inline code from a markdown body before
 * scanning for wiki-links. Cheap and good enough for the regex pass we
 * use here — the authoritative version is in remark-wiki-link.ts which
 * walks the MDAST proper.
 */
function stripCode(body: string): string {
  return body
    // fenced code (``` ... ``` and ~~~ ... ~~~)
    .replace(/```[\s\S]*?```/g, '')
    .replace(/~~~[\s\S]*?~~~/g, '')
    // inline code
    .replace(/`[^`\n]*`/g, '');
}

function extractRefs(body: string): string[] {
  const cleaned = stripCode(body);
  const refs: string[] = [];
  for (const match of cleaned.matchAll(WIKI_LINK_RE)) {
    refs.push(match[1]);
  }
  return refs;
}

export function buildLinkIndex<E extends WikiEntryLike>(entries: E[]): LinkIndex {
  const outgoing = new Map<string, Set<string>>();
  const incoming = new Map<string, Set<string>>();

  for (const e of entries) {
    const refs = extractRefs(e.body ?? '');
    if (refs.length === 0) continue;

    let out = outgoing.get(e.id);
    if (!out) {
      out = new Set();
      outgoing.set(e.id, out);
    }
    for (const ref of refs) {
      out.add(ref);
      let inc = incoming.get(ref);
      if (!inc) {
        inc = new Set();
        incoming.set(ref, inc);
      }
      inc.add(e.id);
    }
  }

  return { outgoing, incoming };
}

export function backlinksFor<E extends WikiEntryLike>(
  slug: string,
  index: LinkIndex,
  entries: E[],
): E[] {
  const sources = index.incoming.get(slug);
  if (!sources) return [];

  const byId = new Map(entries.map(e => [e.id, e]));
  const result: E[] = [];
  for (const sourceId of sources) {
    if (sourceId === slug) continue; // exclude self-links
    const entry = byId.get(sourceId);
    if (entry) result.push(entry);
  }
  result.sort((a, b) => displayTitle(a).localeCompare(displayTitle(b)));
  return result;
}

export function graphData<E extends WikiEntryLike>(
  entries: E[],
  index: LinkIndex,
): GraphData {
  const known = new Set(entries.map(e => e.id));
  const nodes: GraphNode[] = entries.map(e => ({
    id: e.id,
    label: displayTitle(e),
    url: entryToUrl(e.id),
  }));

  const edges: GraphEdge[] = [];
  for (const [from, targets] of index.outgoing) {
    if (!known.has(from)) continue; // shouldn't happen, defensive
    for (const to of targets) {
      if (!known.has(to)) continue; // skip dangling references
      edges.push({ from, to });
    }
  }

  return { nodes, edges };
}
