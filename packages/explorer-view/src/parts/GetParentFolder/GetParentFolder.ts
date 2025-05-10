import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'

export const getParentFolder = (dirents: readonly ExplorerItem[], index: number, root: string): string => {
  if (index < 0) {
    return root
  }
  return dirents[index].path
}
