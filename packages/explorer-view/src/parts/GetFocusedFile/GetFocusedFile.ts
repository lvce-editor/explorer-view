import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as DirentType from '../DirentType/DirentType.ts'

export const getFocusedFile = (state: ExplorerState): ExplorerItem | undefined => {
  const { focusedIndex, items } = state
  if (focusedIndex < 0 || focusedIndex >= items.length) {
    return undefined
  }
  const item = items[focusedIndex]
  if (item.type !== DirentType.File) {
    return undefined
  }
  return item
}
