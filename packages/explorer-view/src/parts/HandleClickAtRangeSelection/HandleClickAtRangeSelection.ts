import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as HandleRangeSelection from '../HandleRangeSelection/HandleRangeSelection.ts'

export const handleClickAtRangeSelection = async (state: ExplorerState, index: number): Promise<ExplorerState> => {
  const { items } = state
  const firstSelectedIndex = items.findIndex((item) => item.selected)
  if (firstSelectedIndex === -1) {
    const newState = await HandleRangeSelection.handleRangeSelection(state, index, index)
    return {
      ...newState,
      pointerDownIndex: -1,
    }
  }
  const min = Math.min(firstSelectedIndex, index)
  const max = Math.min(firstSelectedIndex, index)
  const newState = await HandleRangeSelection.handleRangeSelection(state, min, max)
  return {
    ...newState,
    pointerDownIndex: -1,
  }
}
