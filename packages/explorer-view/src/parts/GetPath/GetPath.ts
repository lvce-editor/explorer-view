import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'

export const getPath = (dirent: ExplorerItem): string => {
  return dirent.path
}
