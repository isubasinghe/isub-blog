// Path helpers used by wiki page components. Kept separate from graph.ts so
// components don't pay for the link-index machinery just to render chrome.

import { entryToUrl } from './graph';

export interface Crumb {
  label: string;
  url: string;
  current: boolean;
}

// Case-insensitive — Astro lowercases ids but the remark plugin sees the
// raw filename. See graph.ts for the same constants.
const FOLDER_INDEX_SUFFIX_RE = /\/(?:index|readme)$/i;
const ROOT_INDEX_RE = /^(?:index|readme)$/i;

function stripFolderIndexSuffix(id: string): string {
  return id.replace(FOLDER_INDEX_SUFFIX_RE, '');
}

export function isFolderIndex(id: string): boolean {
  return ROOT_INDEX_RE.test(id) || FOLDER_INDEX_SUFFIX_RE.test(id);
}

export function folderIdOf(id: string): string {
  if (ROOT_INDEX_RE.test(id)) return id;
  if (FOLDER_INDEX_SUFFIX_RE.test(id)) return stripFolderIndexSuffix(id);
  return id;
}

export function breadcrumbs(id: string): Crumb[] {
  if (ROOT_INDEX_RE.test(id)) {
    return [{ label: 'Wiki', url: '/wiki', current: true }];
  }

  const segments = FOLDER_INDEX_SUFFIX_RE.test(id)
    ? stripFolderIndexSuffix(id).split('/')
    : id.split('/');

  const crumbs: Crumb[] = [{ label: 'Wiki', url: '/wiki', current: false }];
  let acc = '';
  for (let i = 0; i < segments.length; i++) {
    acc = acc ? `${acc}/${segments[i]}` : segments[i];
    crumbs.push({
      label: segments[i],
      url: entryToUrl(acc),
      current: i === segments.length - 1,
    });
  }
  return crumbs;
}

export function childrenOf<E extends { id: string }>(
  parentId: string,
  entries: E[],
): E[] {
  const isRoot = ROOT_INDEX_RE.test(parentId);
  const folder = isRoot ? '' : parentId;
  const prefix = folder ? folder + '/' : '';

  return entries.filter(e => {
    if (ROOT_INDEX_RE.test(e.id)) return false;
    if (folder) {
      // exclude the folder's own index/README
      if (e.id.toLowerCase() === (folder + '/index').toLowerCase()) return false;
      if (e.id.toLowerCase() === (folder + '/readme').toLowerCase()) return false;
      if (!e.id.startsWith(prefix)) return false;
    }
    const rest = folder ? e.id.slice(prefix.length) : e.id;
    if (!rest.includes('/')) return true;
    // Allow folder index pages at one level deeper (e.g. "distributed/index"
    // or "distributed/README" is a direct child of root).
    if (!FOLDER_INDEX_SUFFIX_RE.test(rest)) return false;
    const folderPart = stripFolderIndexSuffix(rest);
    return !folderPart.includes('/');
  });
}

export function siblingsOf<E extends { id: string }>(
  id: string,
  entries: E[],
): E[] {
  if (ROOT_INDEX_RE.test(id)) return [];
  // For a folder index page, siblings live at the parent level alongside
  // *this folder* itself — not alongside other pages inside this folder.
  const lookupId = FOLDER_INDEX_SUFFIX_RE.test(id)
    ? stripFolderIndexSuffix(id)
    : id;
  const lastSlash = lookupId.lastIndexOf('/');
  const parentId = lastSlash === -1 ? 'index' : lookupId.slice(0, lastSlash);
  return childrenOf(parentId, entries).filter(e => e.id !== id);
}
