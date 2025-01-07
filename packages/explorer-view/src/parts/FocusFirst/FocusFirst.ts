import type { ExplorerState } from '../EXplorerState/ExplorerState.ts'
import { focusIndex } from '../FocusIndex/FocusIndex.ts'

export const focusFirst = (state: ExplorerState): ExplorerState => {
  const { focusedIndex, items } = state
  if (items.length === 0 || focusedIndex === 0) {
    return state
  }
  return focusIndex(state, 0)
}
