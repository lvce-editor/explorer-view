import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as HandleSelection from '../HandleSelection/HandleSelection.ts'

export const selectUp = (state: ExplorerState): ExplorerState => {
  const { focusedIndex } = state
  if (focusedIndex <= 0) {
    return state
  }
  return HandleSelection.handleSelection(state, focusedIndex - 1)
}
