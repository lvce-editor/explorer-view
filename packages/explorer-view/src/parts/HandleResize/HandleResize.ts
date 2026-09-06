import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as GetExplorerMaxLineY from '../GetMaxLineY/GetMaxLineY.ts'
import * as GetScrollBarSize from '../GetScrollBarSize/GetScrollBarSize.ts'

export interface Dimensions {
  readonly height: number
  readonly width: number
  readonly x?: number
  readonly y?: number
}

export const handleResize = (state: ExplorerState, dimensions: Dimensions): ExplorerState => {
  const {
    deltaY: currentDeltaY,
    height: currentHeight,
    itemHeight,
    items,
    maxLineY: currentMaxLineY,
    minLineY: currentMinLineY,
    scrollBarHeight: currentScrollBarHeight,
    width: currentWidth,
    x: currentX,
    y: currentY,
  } = state
  const { height: rawHeight, width: rawWidth } = dimensions
  const { x = currentX, y = currentY } = dimensions
  if (!Number.isFinite(rawHeight) || !Number.isFinite(rawWidth) || !Number.isFinite(x) || !Number.isFinite(y)) {
    return state
  }
  const height = Math.max(0, rawHeight)
  const width = Math.max(0, rawWidth)
  const contentHeight = items.length * itemHeight
  const maxDeltaY = Math.max(contentHeight - height, 0)
  const newDeltaY = Math.min(Math.max(currentDeltaY, 0), maxDeltaY)
  const minLineY = Math.round(newDeltaY / itemHeight)
  const maxLineY = GetExplorerMaxLineY.getExplorerMaxLineY(minLineY, height, itemHeight, items.length)
  const scrollBarHeight = GetScrollBarSize.getScrollBarSize(height, contentHeight, 20)
  if (
    currentHeight === height &&
    currentWidth === width &&
    currentX === x &&
    currentY === y &&
    currentDeltaY === newDeltaY &&
    currentMinLineY === minLineY &&
    currentMaxLineY === maxLineY &&
    currentScrollBarHeight === scrollBarHeight
  ) {
    return state
  }
  return {
    ...state,
    deltaY: newDeltaY,
    height,
    maxLineY,
    minLineY,
    scrollBarHeight,
    width,
    x,
    y,
  }
}
