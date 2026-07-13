import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import * as DirentType from '../DirentType/DirentType.ts'

const directoryTypes = new Set([DirentType.DirectoryExpanded, DirentType.DirectoryExpanding, DirentType.EditingDirectoryExpanded])

const getParentPath = (path: string, pathSeparator: string): string => {
  const index = path.lastIndexOf(pathSeparator)
  if (index === -1) {
    return ''
  }
  return path.slice(0, index)
}

export const getGitIgnoreCandidateDirs = (root: string, items: readonly ExplorerItem[], pathSeparator: string): readonly string[] => {
  const dirs = new Set([root])
  for (const item of items) {
    if (directoryTypes.has(item.type)) {
      dirs.add(item.path)
    }
    const parent = getParentPath(item.path, pathSeparator)
    if (parent && parent.startsWith(root)) {
      dirs.add(parent)
    }
  }
  return [...dirs]
}
