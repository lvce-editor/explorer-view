import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'

export const handleRangeSelection = (state: ExplorerState, startIndex: number, endIndex: number): ExplorerState => {
  const { items } = state
  const [min, max] = [Math.min(startIndex, endIndex), Math.max(startIndex, endIndex)]
  const newItems = items.map((item, i) => ({
    ...item,
    selected: i >= min && i <= max ? true : item.selected,
  }))
  return {
    ...state,
    items: newItems,
  }
}
