import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as GetExplorerMaxLineY from '../GetMaxLineY/GetMaxLineY.ts'

export const setDeltaY = (state: ExplorerState, deltaY: number): Promise<ExplorerState> => {
  const { deltaY: currentDeltaY, height, itemHeight, items } = state
  if (!Number.isFinite(deltaY)) {
    return Promise.resolve(state)
  }
  if (deltaY < 0) {
    deltaY = 0
  } else if (deltaY > items.length * itemHeight - height) {
    deltaY = Math.max(items.length * itemHeight - height, 0)
  }
  if (currentDeltaY === deltaY) {
    return Promise.resolve(state)
  }
  const minLineY = Math.floor(deltaY / itemHeight)
  const maxLineY = GetExplorerMaxLineY.getExplorerMaxLineY(minLineY, height, itemHeight, items.length)
  return Promise.resolve({
    ...state,
    deltaY,
    maxLineY,
    minLineY,
  })
}
