// Strip the first H1 from the start of a wiki markdown body. Scoped to
// files under src/content/wiki/ so blog posts (which legitimately lead with
// an H1) are untouched. The wiki page templates always render an H1 derived
// from displayTitle(), so this removes the duplicate at the top of the
// body. We only consider the very first non-blank block — if real prose
// comes before the heading, we leave it alone.

import type { Plugin } from 'unified';
import type { Root, Content } from 'mdast';

const WIKI_PATH_FRAGMENT = '/content/wiki/';

function isLeadingHeading(children: Content[]): number {
  for (let i = 0; i < children.length; i++) {
    const node = children[i];
    // Skip yaml frontmatter / definition nodes that may appear before content.
    if (node.type === 'yaml' || node.type === 'definition') continue;
    return node.type === 'heading' && (node as any).depth === 1 ? i : -1;
  }
  return -1;
}

export const remarkStripLeadingH1: Plugin<[], Root> = () => {
  return (tree, file) => {
    const filePath = file.path ?? '';
    if (!filePath.includes(WIKI_PATH_FRAGMENT)) return;
    const idx = isLeadingHeading(tree.children as Content[]);
    if (idx >= 0) {
      tree.children.splice(idx, 1);
    }
  };
};

export default remarkStripLeadingH1;
