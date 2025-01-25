import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as ScrollInto from '../ScrollInto/ScrollInto.ts'

export const revealItemVisible = (state: ExplorerState, index: number): ExplorerState => {
  const { minLineY, maxLineY } = state
  const { newMinLineY, newMaxLineY } = ScrollInto.scrollInto(index, minLineY, maxLineY)
  return {
    ...state,
    focused: true,
    focusedIndex: index,
    minLineY: newMinLineY,
    maxLineY: newMaxLineY,
  }
}
