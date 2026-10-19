import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'

export const getContainingFolder = (
  root: string,
  dirents: readonly Pick<ExplorerItem, 'name' | 'uri'>[],
  focusedIndex: number,
  _pathSeparator: string,
): string => {
  if (focusedIndex < 0) {
    return root
  }
  const dirent = dirents[focusedIndex]
  const direntPath = dirent.uri
  const direntParentPath = direntPath.slice(0, -(dirent.name.length + 1))
  const path = direntParentPath
  return path
}
