import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'

export const selectDown = (state: ExplorerState): ExplorerState => {
  const { items, focusedIndex } = state
  const firstSelectedIndex = items.findIndex((item) => item.selected)
  const targetIndex = firstSelectedIndex === -1 ? focusedIndex : firstSelectedIndex
  if (targetIndex >= items.length - 1) {
    return state
  }
  const newItems = items.map((item, i) => ({
    ...item,
    selected: i === targetIndex + 1 ? true : item.selected,
  }))
  return {
    ...state,
    items: newItems,
  }
}
