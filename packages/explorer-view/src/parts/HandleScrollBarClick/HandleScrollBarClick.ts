import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import { getNewDeltaYPercent } from '../GetNewDeltaYPercent/GetNewDeltaYPercent.ts'
import { getScrollBarSize } from '../GetScrollBarSize/GetScrollBarSize.ts'
import { setDeltaY } from '../SetDeltaY/SetDeltaY.ts'

export const handleScrollBarClick = async (state: ExplorerState, eventY: number): Promise<ExplorerState> => {
  const { deltaY, height, itemHeight, items, y } = state
  const contentHeight = items.length * itemHeight
  const finalDeltaY = Math.max(contentHeight - height, 0)
  const scrollBarHeight = getScrollBarSize(height, contentHeight, 20)
  const availableTrackHeight = height - scrollBarHeight
  if (finalDeltaY === 0 || availableTrackHeight <= 0) {
    return state
  }
  const relativeY = eventY - y
  const currentScrollBarY = (deltaY / finalDeltaY) * availableTrackHeight
  const offsetInThumb = relativeY - currentScrollBarY
  if (offsetInThumb >= 0 && offsetInThumb < scrollBarHeight) {
    return {
      ...state,
      handleOffset: offsetInThumb,
      scrollBarActive: true,
    }
  }
  const { handleOffset, percent } = getNewDeltaYPercent(height, scrollBarHeight, relativeY)
  return {
    ...(await setDeltaY(state, percent * finalDeltaY)),
    handleOffset,
    scrollBarActive: true,
  }
}
