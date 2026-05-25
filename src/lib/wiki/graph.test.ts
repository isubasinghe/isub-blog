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
});
