import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'

export const focusIndex = (state: ExplorerState, index: number): ExplorerState => {
  const { items, maxLineY, minLineY } = state
  const newItems = items.map((item, i) => ({
    ...item,
    selected: i === index ? false : false,
  }))
  if (index < minLineY) {
    if (index < 0) {
      return {
        ...state,
        focused: true,
        focusedIndex: index,
        items: newItems,
        pendingFocusedIndex: -1,
      }
    }
    const diff = maxLineY - minLineY
    return {
      ...state,
      focused: true,
      focusedIndex: index,
      items: newItems,
      maxLineY: index + diff,
      minLineY: index,
      pendingFocusedIndex: -1,
    }
  }
  if (index >= maxLineY) {
    const diff = maxLineY - minLineY
    return {
      ...state,
      focused: true,
      focusedIndex: index,
      items: newItems,
      maxLineY: index + 1,
      minLineY: index + 1 - diff,
      pendingFocusedIndex: -1,
    }
  }
  return {
    ...state,
    focused: true,
    focusedIndex: index,
    items: newItems,
    pendingFocusedIndex: -1,
  }
}
