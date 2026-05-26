import { describe, it, expect } from 'vitest';
import {
  breadcrumbs,
  childrenOf,
  siblingsOf,
  folderIdOf,
  isFolderIndex,
  knownFolderIndexes,
} from './paths';

const e = (id: string) => ({ id });

describe('breadcrumbs', () => {
  it('root index → single Wiki crumb', () => {
    expect(breadcrumbs('index')).toEqual([
      { label: 'Wiki', url: '/wiki', current: true },
    ]);
  });

  it('top-level entry → Wiki › <name>', () => {
    expect(breadcrumbs('atomic-ops')).toEqual([
      { label: 'Wiki', url: '/wiki', current: false },
      { label: 'atomic-ops', url: '/wiki/atomic-ops', current: true },
    ]);
  });

  it('nested entry → Wiki › <folder> › <name>', () => {
    expect(breadcrumbs('concurrency/atomic-ops')).toEqual([
      { label: 'Wiki', url: '/wiki', current: false },
      { label: 'concurrency', url: '/wiki/concurrency', current: false },
      { label: 'atomic-ops', url: '/wiki/concurrency/atomic-ops', current: true },
    ]);
  });

  it('folder index → Wiki › <folder> (no duplicate trailing crumb)', () => {
    expect(breadcrumbs('concurrency/index')).toEqual([
      { label: 'Wiki', url: '/wiki', current: false },
      { label: 'concurrency', url: '/wiki/concurrency', current: true },
    ]);
  });

  it('folder README → Wiki › <folder> (same shape as folder index)', () => {
    expect(breadcrumbs('concurrency/README')).toEqual([
      { label: 'Wiki', url: '/wiki', current: false },
      { label: 'concurrency', url: '/wiki/concurrency', current: true },
    ]);
  });

  it('root README → single Wiki crumb', () => {
    expect(breadcrumbs('README')).toEqual([
      { label: 'Wiki', url: '/wiki', current: true },
    ]);
  });

  it('deeply nested entry includes every parent', () => {
    const c = breadcrumbs('a/b/c');
    expect(c.map(x => x.label)).toEqual(['Wiki', 'a', 'b', 'c']);
    expect(c.map(x => x.url)).toEqual(['/wiki', '/wiki/a', '/wiki/a/b', '/wiki/a/b/c']);
    expect(c[c.length - 1].current).toBe(true);
  });

  describe('with knownFolderIndexes', () => {
    it('renders a folder segment without an index as non-linkable (url null)', () => {
      // "a/b/c" where folder "a" has an index but "a/b" does not.
      const c = breadcrumbs('a/b/c', new Set(['a']));
      expect(c.map(x => x.url)).toEqual(['/wiki', '/wiki/a', null, '/wiki/a/b/c']);
      expect(c[2].label).toBe('b');
      expect(c[2].current).toBe(false);
    });

    it('keeps every folder segment linkable when each has an index', () => {
      const c = breadcrumbs('a/b/c', new Set(['a', 'a/b']));
      expect(c.map(x => x.url)).toEqual(['/wiki', '/wiki/a', '/wiki/a/b', '/wiki/a/b/c']);
    });

    it('keeps the root "Wiki" crumb linkable even when no entries have indexes', () => {
      // /wiki is served by index.astro regardless of whether a root README
      // entry exists, so the root crumb is always navigable.
      const c = breadcrumbs('a/b/c', new Set());
      expect(c[0]).toEqual({ label: 'Wiki', url: '/wiki', current: false });
      expect(c[1].url).toBeNull();
      expect(c[2].url).toBeNull();
    });

    it('still marks the leaf segment as current regardless of the parent set', () => {
      const c = breadcrumbs('a/b/c', new Set());
      expect(c[c.length - 1].current).toBe(true);
      expect(c[c.length - 1].label).toBe('c');
    });
  });
});

describe('knownFolderIndexes', () => {
  it('collects folder paths of every index/README entry', () => {
    const entries = [
      e('README'),
      e('software_engineering/README'),
      e('software_engineering/management/README'),
      e('software_engineering/management/quality_management/quality_assurance'),
      e('software_engineering/management/project_scheduleing/project_tracking_control'),
    ];
    const set = knownFolderIndexes(entries);
    // Root index resolves to the empty folder path.
    expect(set.has('')).toBe(true);
    expect(set.has('software_engineering')).toBe(true);
    expect(set.has('software_engineering/management')).toBe(true);
    // Folders without a README aren't in the set.
    expect(set.has('software_engineering/management/quality_management')).toBe(false);
    expect(set.has('software_engineering/management/project_scheduleing')).toBe(false);
  });

  it('treats both index.md and README.md (any case) as a folder index', () => {
    const entries = [
      e('foo/index'),
      e('bar/readme'),
      e('baz/README'),
    ];
    const set = knownFolderIndexes(entries);
    expect(set.has('foo')).toBe(true);
    expect(set.has('bar')).toBe(true);
    expect(set.has('baz')).toBe(true);
  });
});

describe('childrenOf', () => {
  const entries = [
    e('index'),
    e('atomic-ops'),
    e('concurrency/index'),
    e('concurrency/mesi'),
    e('concurrency/sub/deeper'),
    e('orphan/page'), // folder with no index.md
  ];

  it('lists top-level children when parent is "index"', () => {
    const ids = childrenOf('index', entries).map(x => x.id);
    expect(ids.sort()).toEqual(['atomic-ops', 'concurrency/index'].sort());
  });

  it('lists direct children of a folder, excluding the folder index itself', () => {
    const ids = childrenOf('concurrency', entries).map(x => x.id);
    expect(ids.sort()).toEqual(['concurrency/mesi'].sort());
  });

  it('does not include grandchildren', () => {
    const ids = childrenOf('concurrency', entries).map(x => x.id);
    expect(ids).not.toContain('concurrency/sub/deeper');
  });

  it('omits descendants of folders without an index.md (no navigable parent)', () => {
    const ids = childrenOf('index', entries).map(x => x.id);
    expect(ids).not.toContain('orphan/page');
  });

  it('treats README as a folder index for child listing', () => {
    const list = [
      e('README'),
      e('physics/README'),
      e('physics/relativity'),
      e('math/calculus'), // no index here, should be omitted from root listing
    ];
    const top = childrenOf('index', list).map(x => x.id).sort();
    expect(top).toEqual(['physics/README']);

    const phys = childrenOf('physics', list).map(x => x.id).sort();
    expect(phys).toEqual(['physics/relativity']);
  });
});

describe('siblingsOf', () => {
  const entries = [
    e('index'),
    e('a'),
    e('b'),
    e('concurrency/index'),
    e('concurrency/mesi'),
    e('concurrency/atomic-ops'),
  ];

  it('returns top-level siblings excluding self, including folder indexes', () => {
    const ids = siblingsOf('a', entries).map(x => x.id).sort();
    expect(ids).toEqual(['b', 'concurrency/index'].sort());
  });

  it('returns nested siblings excluding self and the parent index', () => {
    const ids = siblingsOf('concurrency/mesi', entries).map(x => x.id).sort();
    expect(ids).toEqual(['concurrency/atomic-ops']);
  });

  it('root index has no siblings', () => {
    expect(siblingsOf('index', entries)).toEqual([]);
  });
});

describe('folderIdOf', () => {
  it('returns the folder id for a folder index', () => {
    expect(folderIdOf('concurrency/index')).toBe('concurrency');
  });

  it('returns the folder id for a folder README', () => {
    expect(folderIdOf('concurrency/README')).toBe('concurrency');
  });

  it('returns the entry id unchanged for a normal page', () => {
    expect(folderIdOf('concurrency/atomic-ops')).toBe('concurrency/atomic-ops');
  });

  it('returns "index" / "README" unchanged for the root', () => {
    expect(folderIdOf('index')).toBe('index');
    expect(folderIdOf('README')).toBe('README');
  });
});

describe('isFolderIndex', () => {
  it('true for root and folder index/README pages', () => {
    expect(isFolderIndex('index')).toBe(true);
    expect(isFolderIndex('README')).toBe(true);
    expect(isFolderIndex('readme')).toBe(true);
    expect(isFolderIndex('concurrency/index')).toBe(true);
    expect(isFolderIndex('concurrency/README')).toBe(true);
    expect(isFolderIndex('concurrency/readme')).toBe(true);
  });

  it('false for non-index pages', () => {
    expect(isFolderIndex('concurrency/atomic-ops')).toBe(false);
    expect(isFolderIndex('atomic-ops')).toBe(false);
  });
});

describe('siblingsOf with README folder indexes', () => {
  const entries = [
    e('README'),
    e('physics/README'),
    e('physics/relativity'),
    e('math/README'),
  ];

  it('lists the other folder READMEs as siblings of a sub-page', () => {
    const ids = siblingsOf('physics/relativity', entries).map(x => x.id).sort();
    expect(ids).toEqual([]);
  });

  it('treats other folder READMEs as siblings of a folder README', () => {
    const ids = siblingsOf('physics/README', entries).map(x => x.id).sort();
    expect(ids).toEqual(['math/README']);
  });
});
