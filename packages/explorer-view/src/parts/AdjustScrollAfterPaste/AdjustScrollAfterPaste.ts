import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as GetExplorerMaxLineY from '../GetMaxLineY/GetMaxLineY.ts'
import * as ScrollInto from '../ScrollInto/ScrollInto.ts'

export const adjustScrollAfterPaste = (state: ExplorerState, focusedIndex: number): ExplorerState => {
  const { height, itemHeight, items, maxLineY, minLineY } = state
  const currentMaxLineY = Math.max(maxLineY, GetExplorerMaxLineY.getExplorerMaxLineY(minLineY, height, itemHeight, items.length))
  const { newMaxLineY, newMinLineY } = ScrollInto.scrollInto(focusedIndex, minLineY, currentMaxLineY)
  const newDeltaY = newMinLineY * itemHeight

  return {
    ...state,
    deltaY: newDeltaY,
    focused: true,
    focusedIndex,
    maxLineY: newMaxLineY,
    minLineY: newMinLineY,
  }
}
