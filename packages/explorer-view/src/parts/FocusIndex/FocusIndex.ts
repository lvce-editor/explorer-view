import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'

export const focusIndex = (state: ExplorerState, index: number): ExplorerState => {
  const { minLineY, maxLineY, items } = state
  const newItems = items.map((item, i) => ({
    ...item,
    selected: i === index ? true : false,
  }))
  if (index < minLineY) {
    if (index < 0) {
      return {
        ...state,
        items: newItems,
        focusedIndex: index,
        focused: true,
      }
    }
    const diff = maxLineY - minLineY
    return {
      ...state,
      items: newItems,
      focusedIndex: index,
      focused: true,
      minLineY: index,
      maxLineY: index + diff,
    }
  }
  if (index >= maxLineY) {
    const diff = maxLineY - minLineY
    return {
      ...state,
      items: newItems,
      focusedIndex: index,
      focused: true,
      minLineY: index + 1 - diff,
      maxLineY: index + 1,
    }
  }
  return {
    ...state,
    items: newItems,
    focusedIndex: index,
    focused: true,
  }
}
