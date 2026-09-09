import { displayTitle, entryToUrl, type WikiEntryLike } from './graph';

export interface WikiTreeNode {
  id: string;
  title: string;
  url: string | null;
  description?: string;
  children: WikiTreeNode[];
  /** Number of linked pages below this node, excluding its own overview. */
  descendantCount: number;
}

/** Include intermediate folders even when they have no published index page. */
export function buildPageTree<E extends WikiEntryLike & { data: { description?: string } }>(
  parentId: string,
  entries: E[],
): WikiTreeNode[] {
  const parentPath = entryToUrl(parentId).replace(/^\/wiki\/?/, '');
  const prefix = parentPath ? `${parentPath}/` : '';
  const roots: WikiTreeNode[] = [];
  const nodes = new Map<string, WikiTreeNode>();

  for (const entry of entries) {
    const entryPath = entryToUrl(entry.id).replace(/^\/wiki\/?/, '');
    if (!entryPath || entryPath === parentPath || !entryPath.startsWith(prefix)) continue;

    const segments = entryPath.slice(prefix.length).split('/');
    let children = roots;
    let path = parentPath;

    for (const segment of segments) {
      path = path ? `${path}/${segment}` : segment;
      let node = nodes.get(path);
      if (!node) {
        node = {
          id: path,
          title: segment.replace(/[_-]+/g, ' ').trim(),
          url: null,
          children: [],
          descendantCount: 0,
        };
        nodes.set(path, node);
        children.push(node);
      }
      if (path === entryPath) {
        node.title = displayTitle(entry);
        node.url = entryToUrl(entry.id);
        node.description = entry.data.description;
      }
      children = node.children;
    }
  }

  function sortAndCount(branch: WikiTreeNode[]): number {
    branch.sort((a, b) =>
      Number(b.children.length > 0) - Number(a.children.length > 0)
      || a.title.localeCompare(b.title)
    );
    return branch.reduce((count, node) => {
      node.descendantCount = sortAndCount(node.children);
      return count + node.descendantCount + Number(node.url !== null);
    }, 0);
  }

  sortAndCount(roots);
  return roots;
}
