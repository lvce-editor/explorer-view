import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as HandleRangeSelection from '../HandleRangeSelection/HandleRangeSelection.ts'

export const handleClickAtRangeSelection = async (state: ExplorerState, index: number): Promise<ExplorerState> => {
  const { focusedIndex, items } = state
  const firstSelectedIndex = items.findIndex((item) => item.selected)
  const anchorIndex = firstSelectedIndex === -1 ? (focusedIndex === -1 ? index : focusedIndex) : firstSelectedIndex
  const min = Math.min(anchorIndex, index)
  const max = Math.max(anchorIndex, index)
  const newState = HandleRangeSelection.handleRangeSelection(state, min, max)
  return {
    ...newState,
    focusedIndex: index,
  }
}
