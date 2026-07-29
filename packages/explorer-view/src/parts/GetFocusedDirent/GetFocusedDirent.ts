import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'

export const getFocusedDirent = (state: ExplorerState): ExplorerItem | undefined => {
  const { focusedIndex, items } = state
  const dirent = items[focusedIndex]
  return dirent
}
