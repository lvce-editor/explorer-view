import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import { getScrollBarSize } from '../GetScrollBarSize/GetScrollBarSize.ts'
import { setDeltaY } from '../SetDeltaY/SetDeltaY.ts'

export const handleScrollBarMove = async (state: ExplorerState, eventY: number): Promise<ExplorerState> => {
  const { handleOffset, height, itemHeight, items, scrollBarActive, y } = state
  if (!scrollBarActive) {
    return state
  }
  const contentHeight = items.length * itemHeight
  const finalDeltaY = Math.max(contentHeight - height, 0)
  const scrollBarHeight = getScrollBarSize(height, contentHeight, 20)
  const availableTrackHeight = height - scrollBarHeight
  if (finalDeltaY === 0 || availableTrackHeight <= 0) {
    return state
  }
  const relativeY = eventY - y - handleOffset
  const percent = relativeY / availableTrackHeight
  return setDeltaY(state, percent * finalDeltaY)
}
