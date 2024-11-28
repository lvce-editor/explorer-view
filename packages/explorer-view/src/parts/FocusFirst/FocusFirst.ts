import { focusIndex } from '../FocusIndex/FocusIndex.ts'

export const focusFirst = (state: any): any => {
  const { focusedIndex, items } = state
  if (items.length === 0 || focusedIndex === 0) {
    return state
  }
  return focusIndex(state, 0)
}
