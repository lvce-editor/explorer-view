import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as GetExplorerMaxLineY from '../GetMaxLineY/GetMaxLineY.ts'
import * as ScrollInto from '../ScrollInto/ScrollInto.ts'

export const revealItemVisible = (state: ExplorerState, index: number): ExplorerState => {
  const { deltaY: currentDeltaY, height, itemHeight, items, maxLineY, minLineY } = state
  const { newMinLineY: requestedMinLineY } = ScrollInto.scrollInto(index, minLineY, maxLineY)
  const requestedDeltaY = requestedMinLineY === minLineY ? currentDeltaY : requestedMinLineY * itemHeight
  const maxDeltaY = Math.max(items.length * itemHeight - height, 0)
  const deltaY = Math.min(Math.max(requestedDeltaY, 0), maxDeltaY)
  const newMinLineY = Math.round(deltaY / itemHeight)
  const newMaxLineY = GetExplorerMaxLineY.getExplorerMaxLineY(newMinLineY, height, itemHeight, items.length)
  return {
    ...state,
    deltaY,
    focused: true,
    focusedIndex: index,
    maxLineY: newMaxLineY,
    minLineY: newMinLineY,
  }
}
