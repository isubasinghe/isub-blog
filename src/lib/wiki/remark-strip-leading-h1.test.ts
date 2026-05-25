import { describe, it, expect } from 'vitest';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkStringify from 'remark-stringify';
import { remarkStripLeadingH1 } from './remark-strip-leading-h1';

function run(markdown: string, filePath: string): string {
  const processor = unified()
    .use(remarkParse)
    .use(remarkStripLeadingH1)
    .use(remarkStringify);
  const file = processor.processSync({ value: markdown, path: filePath });
  return String(file);
}

describe('remarkStripLeadingH1', () => {
  it('strips the leading H1 in a wiki file', () => {
    const out = run(
      '# computer_science\n\nbody here\n',
      '/x/src/content/wiki/computer_science/README.md',
    );
    expect(out).not.toMatch(/^#\s/);
    expect(out).toContain('body here');
  });

  it('does NOT strip the leading H1 in a non-wiki file', () => {
    const out = run(
      '# Blog post\n\nbody here\n',
      '/x/src/content/blog/foo.md',
    );
    expect(out).toMatch(/^# Blog post/);
  });

  it('leaves a non-H1 leading heading alone', () => {
    const out = run(
      '## Sub heading\n\nbody\n',
      '/x/src/content/wiki/foo/README.md',
    );
    expect(out).toMatch(/^## Sub heading/);
  });

  it('leaves prose alone if the H1 is not at the very top', () => {
    const out = run(
      'intro paragraph\n\n# heading later\n',
      '/x/src/content/wiki/foo/README.md',
    );
    expect(out).toMatch(/intro paragraph/);
    expect(out).toMatch(/# heading later/);
  });
});
