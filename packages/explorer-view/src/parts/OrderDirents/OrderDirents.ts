import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'

const isTopLevel = (dirent: any): boolean => {
  return dirent.depth === 1
}

export const orderDirents = (dirents: readonly ExplorerItem[]): readonly ExplorerItem[] => {
  if (dirents.length === 0) {
    return dirents
  }

  const withDeepChildren = (parent: ExplorerItem, processed: Set<string>): ExplorerItem[] => {
    if (processed.has(parent.path)) {
      return []
    }
    processed.add(parent.path)

    const children = []
    for (const dirent of dirents) {
      if (dirent.depth === parent.depth + 1 && dirent.path.startsWith(parent.path)) {
        children.push(...withDeepChildren(dirent, processed))
      }
    }
    return [parent, ...children]
  }

  const topLevelDirents = dirents.filter(isTopLevel)
  const processed = new Set<string>()
  const ordered = topLevelDirents.flatMap((dirent) => withDeepChildren(dirent, processed))
  return ordered
}
