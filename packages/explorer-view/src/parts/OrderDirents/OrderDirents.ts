import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'

export const orderDirents = (dirents: readonly ExplorerItem[]): readonly ExplorerItem[] => {
  if (dirents.length === 0) {
    return dirents
  }
  const minDepth = Math.min(...dirents.map((dirent) => dirent.depth))

  const withDeepChildren = (parent: ExplorerItem, processed: Set<string>): ExplorerItem[] => {
    if (processed.has(parent.uri)) {
      return []
    }
    processed.add(parent.uri)

    const children = []
    for (const dirent of dirents) {
      if (dirent.depth === parent.depth + 1 && dirent.uri.startsWith(parent.uri)) {
        children.push(...withDeepChildren(dirent, processed))
      }
    }
    return [parent, ...children]
  }

  const topLevelDirents = dirents.filter((dirent) => dirent.depth === minDepth)
  const processed = new Set<string>()
  const ordered = topLevelDirents.flatMap((dirent) => withDeepChildren(dirent, processed))
  return ordered
}
