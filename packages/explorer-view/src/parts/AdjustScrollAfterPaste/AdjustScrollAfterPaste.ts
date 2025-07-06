import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as ScrollInto from '../ScrollInto/ScrollInto.ts'

export const adjustScrollAfterPaste = (state: ExplorerState, focusedIndex: number): ExplorerState => {
  const { minLineY, maxLineY, itemHeight } = state
  const { newMinLineY, newMaxLineY } = ScrollInto.scrollInto(focusedIndex, minLineY, maxLineY)
  const newDeltaY = newMinLineY * itemHeight

  return {
    ...state,
    focusedIndex,
    focused: true,
    minLineY: newMinLineY,
    maxLineY: newMaxLineY,
    deltaY: newDeltaY,
  }
}
