import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'

export const getIndex = (dirents: readonly ExplorerItem[], uri: string): number => {
  for (const [i, dirent] of dirents.entries()) {
    if (dirent.uri === uri) {
      return i
    }
  }
  return -1
}
