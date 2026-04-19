import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'

export const getMenuEntriesFocusedDirent = (explorerState: ExplorerState): ExplorerItem | undefined => {
  if (!explorerState || explorerState.focusedIndex < 0) {
    return undefined
  }
  return explorerState.items[explorerState.focusedIndex]
}