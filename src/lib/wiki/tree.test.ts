import { describe, expect, it } from 'vitest';
import { buildPageTree, type WikiTreeNode } from './tree';

const entry = (id: string, title?: string) => ({ id, data: { title } });
const links = (nodes: WikiTreeNode[]): string[] => nodes.flatMap((node) => [
  ...(node.url ? [node.url] : []),
  ...links(node.children),
]);

describe('buildPageTree', () => {
  it('keeps deep pages reachable through folders without index pages', () => {
    const tree = buildPageTree('readme', [
      entry('readme'),
      entry('computer_science/types/linear-types', 'Linear Types'),
    ]);

    expect(tree[0]).toMatchObject({
      title: 'computer science', url: null, descendantCount: 1,
    });
    expect(tree[0].children[0]).toMatchObject({
      title: 'types', url: null, descendantCount: 1,
    });
    expect(links(tree)).toEqual(['/wiki/computer_science/types/linear-types']);
  });

  it('merges folder overview pages into their branches regardless of entry order', () => {
    const entries = [
      entry('physics/relativity/time', 'Time dilation'),
      entry('physics/relativity/index', 'Relativity'),
      entry('physics/README', 'Physics'),
      entry('README'),
    ];
    const tree = buildPageTree('README', entries);

    expect(tree).toEqual(buildPageTree('index', [...entries].reverse()));
    expect(tree[0]).toMatchObject({ title: 'Physics', url: '/wiki/physics', descendantCount: 2 });
    expect(tree[0].children[0]).toMatchObject({
      title: 'Relativity', url: '/wiki/physics/relativity', descendantCount: 1,
    });
    expect(links(tree)).toEqual([
      '/wiki/physics', '/wiki/physics/relativity', '/wiki/physics/relativity/time',
    ]);
  });

  it('limits a topic tree to its descendants and excludes its own overview', () => {
    const entries = [
      entry('math/readme'),
      entry('math/calculus/index'),
      entry('math/calculus/derivatives'),
      entry('mathematics/history'),
      entry('physics/index'),
    ];
    const tree = buildPageTree('math', entries);

    expect(tree).toEqual(buildPageTree('math/readme', entries));
    expect(links(tree)).toEqual(['/wiki/math/calculus', '/wiki/math/calculus/derivatives']);
  });

  it('sorts topics before leaves, then alphabetically by their display titles', () => {
    const tree = buildPageTree('index', [
      entry('z-page', 'A page'),
      entry('a-topic/readme', 'Z topic'),
      entry('a-topic/note'),
      entry('z-topic/index', 'A topic'),
      entry('z-topic/note'),
      entry('a-page', 'Z page'),
    ]);

    expect(tree.map((node) => node.title)).toEqual(['A topic', 'Z topic', 'A page', 'Z page']);
  });

  it('does not add branches for empty collections or the root overview', () => {
    expect(buildPageTree('index', [])).toEqual([]);
    expect(buildPageTree('readme', [entry('readme')])).toEqual([]);
  });
});
