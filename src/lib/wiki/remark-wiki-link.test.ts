import { describe, it, expect } from 'vitest';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkStringify from 'remark-stringify';
import path from 'node:path';
import { remarkWikiLink, _resetCacheForTests } from './remark-wiki-link';

const FIXTURES = path.resolve(__dirname, '../../../test/fixtures/wiki');

function run(markdown: string, base: string = FIXTURES) {
  _resetCacheForTests();
  const processor = unified()
    .use(remarkParse)
    .use(remarkWikiLink, { base })
    .use(remarkStringify);
  const file = processor.processSync(markdown);
  return { output: String(file), messages: file.messages };
}

describe('remark-wiki-link', () => {
  it('rewrites [[slug]] to a markdown link with the slug URL', () => {
    const { output, messages } = run('see [[atomic-ops]] here');
    expect(output).toContain('[Atomic Operations](/wiki/concurrency/atomic-ops)');
    expect(messages).toHaveLength(0);
  });

  it('supports [[slug|display]] aliasing', () => {
    const { output, messages } = run('see [[atomic-ops|atomic stuff]] here');
    expect(output).toContain('[atomic stuff](/wiki/concurrency/atomic-ops)');
    expect(messages).toHaveLength(0);
  });

  it('emits a vfile warning and broken-link HTML for unknown slugs', () => {
    const { output, messages } = run('see [[ghost-page]] here');
    expect(messages).toHaveLength(1);
    expect(messages[0].reason).toMatch(/unknown wiki-link.*ghost-page/);
    expect(output).toContain('class="wiki-link broken"');
    expect(output).toContain('ghost-page');
  });

  it('leaves [[slug]] inside a fenced code block untouched', () => {
    const md = '```\n[[atomic-ops]]\n```\n\nthen [[gossip]] here';
    const { output } = run(md);
    expect(output).toContain('[[atomic-ops]]');
    expect(output).toContain('[Gossip Protocols](/wiki/distributed/gossip)');
  });

  it('leaves [[slug]] inside inline code untouched', () => {
    const { output } = run('inline `[[atomic-ops]]` and real [[gossip]]');
    expect(output).toContain('`[[atomic-ops]]`');
    expect(output).toContain('[Gossip Protocols](/wiki/distributed/gossip)');
  });

  it('rewrites multiple [[slugs]] in one paragraph', () => {
    const { output } = run('see [[atomic-ops]] and [[gossip]]');
    expect(output).toContain('[Atomic Operations](/wiki/concurrency/atomic-ops)');
    expect(output).toContain('[Gossip Protocols](/wiki/distributed/gossip)');
  });

  it('resolves folder index pages by their folder basename', () => {
    // wiki/concurrency/index.md should be linkable as [[concurrency]]
    const { output, messages } = run('see [[concurrency]]');
    expect(messages).toHaveLength(0);
    expect(output).toContain('[Concurrency](/wiki/concurrency)');
  });

  it('resolves folder README pages by their folder basename', () => {
    // wiki/physics/README.md should be linkable as [[physics]]
    const { output, messages } = run('see [[physics]]');
    expect(messages).toHaveLength(0);
    expect(output).toContain('[Physics](/wiki/physics)');
  });

  it('prefers a folder index over a leaf of the same basename', async () => {
    const fs = await import('node:fs/promises');
    const os = await import('node:os');
    const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'wiki-fold-vs-leaf-'));
    try {
      await fs.mkdir(path.join(tmp, 'compression'), { recursive: true });
      // Folder index (README) for "compression" + a leaf inside it that happens
      // to share the basename. The folder index should win the [[compression]]
      // slug; the leaf is still reachable via its full URL.
      await fs.writeFile(
        path.join(tmp, 'compression', 'README.md'),
        '---\ntitle: Compression\n---\n',
      );
      await fs.writeFile(
        path.join(tmp, 'compression', 'compression.md'),
        '---\ntitle: Compression Leaf\n---\n',
      );

      _resetCacheForTests();
      const processor = unified()
        .use(remarkParse)
        .use(remarkWikiLink, { base: tmp })
        .use(remarkStringify);
      const file = processor.processSync('see [[compression]]');
      expect(file.messages).toHaveLength(0);
      expect(String(file)).toContain('[Compression](/wiki/compression)');
    } finally {
      await fs.rm(tmp, { recursive: true, force: true });
    }
  });

  it('keeps the first when two leaves share the same basename, and supports full-path disambiguation', async () => {
    const fs = await import('node:fs/promises');
    const os = await import('node:os');
    const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'wiki-dup-'));
    try {
      await fs.mkdir(path.join(tmp, 'a'), { recursive: true });
      await fs.mkdir(path.join(tmp, 'b'), { recursive: true });
      await fs.writeFile(path.join(tmp, 'a', 'dupe.md'), '---\ntitle: A Dupe\n---\n');
      await fs.writeFile(path.join(tmp, 'b', 'dupe.md'), '---\ntitle: B Dupe\n---\n');

      _resetCacheForTests();
      // Bare [[dupe]] should resolve to *one* of them (whichever sorts first
      // by glob — deterministic enough; we just assert it doesn't throw and
      // a link is produced).
      const proc1 = unified().use(remarkParse).use(remarkWikiLink, { base: tmp }).use(remarkStringify);
      expect(() => proc1.processSync('[[dupe]]')).not.toThrow();
      const out1 = String(proc1.processSync('[[dupe]]'));
      expect(out1).toMatch(/\(\/wiki\/(a|b)\/dupe\)/);

      // Full-path forms always resolve unambiguously.
      _resetCacheForTests();
      const proc2 = unified().use(remarkParse).use(remarkWikiLink, { base: tmp }).use(remarkStringify);
      const aOut = String(proc2.processSync('see [[a/dupe]]'));
      expect(aOut).toContain('[A Dupe](/wiki/a/dupe)');

      _resetCacheForTests();
      const proc3 = unified().use(remarkParse).use(remarkWikiLink, { base: tmp }).use(remarkStringify);
      const bOut = String(proc3.processSync('see [[b/dupe]]'));
      expect(bOut).toContain('[B Dupe](/wiki/b/dupe)');
    } finally {
      await fs.rm(tmp, { recursive: true, force: true });
    }
  });

  it('resolves a folder index via its full folder path', async () => {
    const fs = await import('node:fs/promises');
    const os = await import('node:os');
    const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'wiki-folder-path-'));
    try {
      await fs.mkdir(path.join(tmp, 'math', 'calculus'), { recursive: true });
      await fs.writeFile(
        path.join(tmp, 'math', 'calculus', 'README.md'),
        '---\ntitle: Calculus\n---\n',
      );

      _resetCacheForTests();
      const proc = unified().use(remarkParse).use(remarkWikiLink, { base: tmp }).use(remarkStringify);
      const out = String(proc.processSync('see [[math/calculus]]'));
      expect(out).toContain('[Calculus](/wiki/math/calculus)');
    } finally {
      await fs.rm(tmp, { recursive: true, force: true });
    }
  });
});
