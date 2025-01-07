import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import type { ExplorerState } from '../EXplorerState/ExplorerState.ts'

export const getFocusedDirent = (state: ExplorerState): ExplorerItem => {
  const { focusedIndex, minLineY, items } = state
  const dirent = items[focusedIndex + minLineY]
  return dirent
}
