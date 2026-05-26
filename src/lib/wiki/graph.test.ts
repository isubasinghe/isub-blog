import { describe, it, expect } from 'vitest';
import {
  entryToUrl,
  buildLinkIndex,
  backlinksFor,
  graphData,
  displayTitle,
  type WikiEntryLike,
} from './graph';

// Minimal stand-in for Astro's CollectionEntry<'wiki'>. graph.ts only needs
// id, body, and data.title — typing it as WikiEntryLike keeps these tests
// independent of Astro's content types.
const entry = (
  id: string,
  title: string,
  body: string,
): WikiEntryLike => ({ id, body, data: { title } });

describe('entryToUrl', () => {
  it('maps a nested entry id to /wiki/<id>', () => {
    expect(entryToUrl('concurrency/atomic-ops')).toBe('/wiki/concurrency/atomic-ops');
  });

  it('collapses a sub-folder /index to the folder URL', () => {
    expect(entryToUrl('concurrency/index')).toBe('/wiki/concurrency');
  });

  it('collapses the root index to /wiki', () => {
    expect(entryToUrl('index')).toBe('/wiki');
  });

  it('collapses a sub-folder /README to the folder URL', () => {
    expect(entryToUrl('concurrency/README')).toBe('/wiki/concurrency');
  });

  it('collapses the root README to /wiki', () => {
    expect(entryToUrl('README')).toBe('/wiki');
  });

  it('handles lowercase "readme" too (Astro normalizes ids to lowercase)', () => {
    expect(entryToUrl('readme')).toBe('/wiki');
    expect(entryToUrl('concurrency/readme')).toBe('/wiki/concurrency');
  });
});

describe('displayTitle', () => {
  it('prefers frontmatter title when present', () => {
    expect(displayTitle(entry('a', 'Apple', ''))).toBe('Apple');
  });

  it('falls back to the first markdown H1 in body when title is missing', () => {
    const e: WikiEntryLike = { id: 'foo', body: '# From H1\n\nbody', data: {} };
    expect(displayTitle(e)).toBe('From H1');
  });

  it('falls back to the (prettified) filename basename when title and H1 are both missing', () => {
    const e: WikiEntryLike = { id: 'concurrency/atomic-ops', data: {} };
    expect(displayTitle(e)).toBe('atomic ops');
  });

  it('returns the folder name for a folder README page with no title', () => {
    const e: WikiEntryLike = { id: 'concurrency/README', data: {} };
    expect(displayTitle(e)).toBe('concurrency');
  });

  it('returns the folder name for a folder index page with no title', () => {
    const e: WikiEntryLike = { id: 'concurrency/index', data: {} };
    expect(displayTitle(e)).toBe('concurrency');
  });

  it('returns "Wiki" for the root index/README without title', () => {
    expect(displayTitle({ id: 'index', data: {} })).toBe('Wiki');
    expect(displayTitle({ id: 'README', data: {} })).toBe('Wiki');
  });

  it('decodes markdown backslash-escapes inside the H1 fallback', () => {
    // GitBook/Jekyll source often writes `\_` so the underscore renders
    // literally instead of starting italics. The decoded string must not
    // leak the backslash. Use a multi-word H1 so the "real title" heuristic
    // accepts it.
    const e: WikiEntryLike = {
      id: 'foo',
      body: '# Big O \\_notation\\_',
      data: {},
    };
    expect(displayTitle(e)).toBe('Big O _notation_');
  });

  it('prettifies the basename fallback (underscores and hyphens → spaces)', () => {
    expect(displayTitle({ id: 'data_structures', data: {} })).toBe('data structures');
    expect(displayTitle({ id: 'foo/atomic-ops', data: {} })).toBe('atomic ops');
  });

  it('falls through slug-like H1s (no spaces / single-case) to prettified basename', () => {
    // Source like `# data\_structures` — the H1 is just the slug repeated.
    // Prefer the prettified basename over the raw slug.
    const e1: WikiEntryLike = {
      id: 'computer_science/data_structures/README',
      body: '# data\\_structures\n',
      data: {},
    };
    expect(displayTitle(e1)).toBe('data structures');

    // All-lowercase single-word slug-like H1 with no spaces.
    const e2: WikiEntryLike = {
      id: 'foo/flp_result',
      body: '# flp_result\n',
      data: {},
    };
    expect(displayTitle(e2)).toBe('flp result');
  });

  it('keeps a real H1 that contains a space or mixed case', () => {
    const real: WikiEntryLike = {
      id: 'foo/whatever',
      body: '# FLP Impossibility Result\n',
      data: {},
    };
    expect(displayTitle(real)).toBe('FLP Impossibility Result');
  });
});

describe('buildLinkIndex', () => {
  it('captures outgoing and incoming references from [[slug]] in body', () => {
    const entries = [
      entry('a', 'A', 'links to [[b]] and [[c]]'),
      entry('b', 'B', 'links to [[c]]'),
      entry('c', 'C', 'no links'),
    ];
    const index = buildLinkIndex(entries);

    expect([...(index.outgoing.get('a') ?? [])].sort()).toEqual(['b', 'c']);
    expect([...(index.outgoing.get('b') ?? [])].sort()).toEqual(['c']);
    expect(index.outgoing.get('c')).toBeUndefined();

    expect([...(index.incoming.get('c') ?? [])].sort()).toEqual(['a', 'b']);
    expect([...(index.incoming.get('b') ?? [])].sort()).toEqual(['a']);
    expect(index.incoming.get('a')).toBeUndefined();
  });

  it('treats [[slug|alias]] as a reference to slug', () => {
    const entries = [
      entry('a', 'A', 'see [[b|the second page]]'),
      entry('b', 'B', ''),
    ];
    const index = buildLinkIndex(entries);
    expect([...(index.outgoing.get('a') ?? [])]).toEqual(['b']);
    expect([...(index.incoming.get('b') ?? [])]).toEqual(['a']);
  });

  it('ignores [[slug]] inside fenced code blocks', () => {
    const entries = [
      entry('a', 'A', '```\n[[b]]\n```\nreal: [[c]]'),
      entry('b', 'B', ''),
      entry('c', 'C', ''),
    ];
    const index = buildLinkIndex(entries);
    expect([...(index.outgoing.get('a') ?? [])]).toEqual(['c']);
  });

  it('ignores [[slug]] inside inline code', () => {
    const entries = [
      entry('a', 'A', 'inline `[[b]]` not a link; real: [[c]]'),
      entry('b', 'B', ''),
      entry('c', 'C', ''),
    ];
    const index = buildLinkIndex(entries);
    expect([...(index.outgoing.get('a') ?? [])]).toEqual(['c']);
  });
});

describe('buildLinkIndex - markdown links to .md files', () => {
  it('captures markdown link to a sibling .md file', () => {
    const entries = [
      entry('a', 'A', 'see [B](b.md)'),
      entry('b', 'B', ''),
    ];
    const index = buildLinkIndex(entries);
    expect([...(index.outgoing.get('a') ?? [])]).toEqual(['b']);
    expect([...(index.incoming.get('b') ?? [])]).toEqual(['a']);
  });

  it('resolves markdown links into a subdirectory', () => {
    const entries = [
      entry('a', 'A', '[Foo](sub/foo.md)'),
      entry('sub/foo', 'Foo', ''),
    ];
    const index = buildLinkIndex(entries);
    expect([...(index.outgoing.get('a') ?? [])]).toEqual(['sub/foo']);
  });

  it('resolves markdown links relative to the source file directory', () => {
    const entries = [
      entry('sub/a', 'A', '[Foo](../foo.md)'),
      entry('foo', 'Foo', ''),
    ];
    const index = buildLinkIndex(entries);
    expect([...(index.outgoing.get('sub/a') ?? [])]).toEqual(['foo']);
  });

  it('strips anchor fragments from markdown link targets', () => {
    const entries = [
      entry('a', 'A', '[B](b.md#section)'),
      entry('b', 'B', ''),
    ];
    const index = buildLinkIndex(entries);
    expect([...(index.outgoing.get('a') ?? [])]).toEqual(['b']);
  });

  it('ignores external markdown links (http/https/mailto)', () => {
    const entries = [
      entry('a', 'A', '[Ext](https://example.com/foo.md) and [M](mailto:a@b.md)'),
    ];
    const index = buildLinkIndex(entries);
    expect(index.outgoing.get('a')).toBeUndefined();
  });

  it('ignores non-markdown link targets', () => {
    const entries = [
      entry('a', 'A', '[Img](foo.png) and [Other](bar)'),
    ];
    const index = buildLinkIndex(entries);
    expect(index.outgoing.get('a')).toBeUndefined();
  });

  it('lowercases resolved targets to match Astro id normalization (README.md)', () => {
    const entries = [
      entry('a', 'A', '[Sub](sub/README.md)'),
      entry('sub/readme', 'Sub', ''),
    ];
    const index = buildLinkIndex(entries);
    expect([...(index.outgoing.get('a') ?? [])]).toEqual(['sub/readme']);
  });

  it('decodes backslash-escapes in link targets (CommonMark)', () => {
    // GitBook-style source: `[x](foo\_bar.md)` — backslash keeps `_` literal.
    const entries = [
      entry('a', 'A', '[X](foo\\_bar.md)'),
      entry('foo_bar', 'Foo bar', ''),
    ];
    const index = buildLinkIndex(entries);
    expect([...(index.outgoing.get('a') ?? [])]).toEqual(['foo_bar']);
  });

  it('skips markdown links inside fenced code blocks', () => {
    const entries = [
      entry('a', 'A', '```\n[B](b.md)\n```\nreal: [C](c.md)'),
      entry('b', 'B', ''),
      entry('c', 'C', ''),
    ];
    const index = buildLinkIndex(entries);
    expect([...(index.outgoing.get('a') ?? [])]).toEqual(['c']);
  });

  it('skips markdown links inside inline code', () => {
    const entries = [
      entry('a', 'A', 'inline `[B](b.md)` not a link; real: [C](c.md)'),
      entry('b', 'B', ''),
      entry('c', 'C', ''),
    ];
    const index = buildLinkIndex(entries);
    expect([...(index.outgoing.get('a') ?? [])]).toEqual(['c']);
  });

  it('drops markdown links that resolve outside the wiki root', () => {
    const entries = [
      entry('a', 'A', '[Escape](../../outside.md)'),
    ];
    const index = buildLinkIndex(entries);
    expect(index.outgoing.get('a')).toBeUndefined();
  });

  it('coexists with [[slug]] wiki-link syntax in the same body', () => {
    const entries = [
      entry('a', 'A', 'wiki [[b]] and md [C](c.md)'),
      entry('b', 'B', ''),
      entry('c', 'C', ''),
    ];
    const index = buildLinkIndex(entries);
    expect([...(index.outgoing.get('a') ?? [])].sort()).toEqual(['b', 'c']);
  });
});

describe('backlinksFor', () => {
  it('returns entries that link to the given slug, sorted by title', () => {
    const a = entry('a', 'Apple', 'see [[c]]');
    const b = entry('b', 'Banana', 'see [[c]]');
    const c = entry('c', 'Cherry', '');
    const index = buildLinkIndex([a, b, c]);

    const result = backlinksFor('c', index, [a, b, c]);
    expect(result.map(e => e.id)).toEqual(['a', 'b']);
  });

  it('excludes self-links from backlinks', () => {
    const a = entry('a', 'A', 'self [[a]] and [[b]]');
    const b = entry('b', 'B', 'see [[a]]');
    const index = buildLinkIndex([a, b]);

    const result = backlinksFor('a', index, [a, b]);
    expect(result.map(e => e.id)).toEqual(['b']);
  });

  it('returns empty array when nothing links here', () => {
    const a = entry('a', 'A', '');
    const index = buildLinkIndex([a]);
    expect(backlinksFor('a', index, [a])).toEqual([]);
  });
});

describe('graphData', () => {
  it('shapes nodes and edges for vis-network', () => {
    const a = entry('a', 'A', 'see [[b]]');
    const b = entry('b', 'B', '');
    const index = buildLinkIndex([a, b]);

    const data = graphData([a, b], index);

    expect(data.nodes).toHaveLength(2);
    expect(data.nodes).toContainEqual({ id: 'a', label: 'A', url: '/wiki/a' });
    expect(data.nodes).toContainEqual({ id: 'b', label: 'B', url: '/wiki/b' });

    expect(data.edges).toHaveLength(1);
    expect(data.edges[0]).toEqual({ from: 'a', to: 'b' });
  });

  it('omits edges to unknown slugs', () => {
    const a = entry('a', 'A', 'see [[ghost]]');
    const index = buildLinkIndex([a]);
    const data = graphData([a], index);
    expect(data.edges).toEqual([]);
  });

  describe('structural folder edges', () => {
    // Astro lowercases ids — `README.md` → `readme`. Tests mirror that.
    it('emits an edge from a folder index to each of its direct children', () => {
      const entries = [
        entry('concurrency/readme', 'Concurrency', ''),
        entry('concurrency/atomic-ops', 'Atomic Ops', ''),
        entry('concurrency/mesi', 'MESI', ''),
      ];
      const index = buildLinkIndex(entries);
      const data = graphData(entries, index);
      const pairs = data.edges.map(e => `${e.from}->${e.to}`).sort();
      expect(pairs).toEqual([
        'concurrency/readme->concurrency/atomic-ops',
        'concurrency/readme->concurrency/mesi',
      ]);
    });

    it('treats a sub-folder index as a child of the parent folder index', () => {
      const entries = [
        entry('concurrency/readme', 'Concurrency', ''),
        entry('concurrency/mesi/readme', 'MESI', ''),
        entry('concurrency/mesi/protocol', 'Protocol', ''),
      ];
      const index = buildLinkIndex(entries);
      const data = graphData(entries, index);
      const pairs = data.edges.map(e => `${e.from}->${e.to}`).sort();
      expect(pairs).toEqual([
        'concurrency/mesi/readme->concurrency/mesi/protocol',
        'concurrency/readme->concurrency/mesi/readme',
      ]);
    });

    it('connects the root index to top-level entries and folder indexes', () => {
      const entries = [
        entry('readme', 'Wiki', ''),
        entry('about', 'About', ''),
        entry('math/readme', 'Math', ''),
      ];
      const index = buildLinkIndex(entries);
      const data = graphData(entries, index);
      const pairs = data.edges.map(e => `${e.from}->${e.to}`).sort();
      expect(pairs).toEqual([
        'readme->about',
        'readme->math/readme',
      ]);
    });

    it('emits no structural edge when the parent folder has no index page', () => {
      const entries = [
        entry('orphan-folder/leaf', 'Leaf', ''),
      ];
      const index = buildLinkIndex(entries);
      const data = graphData(entries, index);
      expect(data.edges).toEqual([]);
    });

    it('does not emit a self-edge for the root index', () => {
      const entries = [entry('readme', 'Wiki', '')];
      const index = buildLinkIndex(entries);
      const data = graphData(entries, index);
      expect(data.edges).toEqual([]);
    });

    it('deduplicates a structural edge against an identical content link', () => {
      // README explicitly links to its child; structural pass would emit
      // the same edge. Only one edge should appear.
      const entries = [
        entry('concurrency/readme', 'Concurrency', '[Ops](atomic-ops.md)'),
        entry('concurrency/atomic-ops', 'Atomic Ops', ''),
      ];
      const index = buildLinkIndex(entries);
      const data = graphData(entries, index);
      expect(data.edges).toEqual([
        { from: 'concurrency/readme', to: 'concurrency/atomic-ops' },
      ]);
    });

    it('combines content edges with structural edges', () => {
      const entries = [
        entry('concurrency/readme', 'Concurrency', ''),
        entry('concurrency/a', 'A', '[B](b.md)'),
        entry('concurrency/b', 'B', ''),
      ];
      const index = buildLinkIndex(entries);
      const data = graphData(entries, index);
      const pairs = data.edges.map(e => `${e.from}->${e.to}`).sort();
      expect(pairs).toEqual([
        'concurrency/a->concurrency/b',
        'concurrency/readme->concurrency/a',
        'concurrency/readme->concurrency/b',
      ]);
    });
  });
});
