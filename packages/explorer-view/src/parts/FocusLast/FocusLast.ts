import * as Arrays from '../Arrays/Arrays.ts'
import { focusIndex } from '../FocusIndex/FocusIndex.ts'

export const focusLast = (state: any): any => {
  const { focusedIndex, items } = state
  const lastIndex = Arrays.lastIndex(items)
  if (items.length === 0 || focusedIndex === lastIndex) {
    return state
  }
  return focusIndex(state, lastIndex)
}
