import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as GetFileIcons from '../GetFileIcons/GetFileIcons.ts'

export const setDeltaY = async (state: ExplorerState, deltaY: number): Promise<ExplorerState> => {
  const { itemHeight, height, items } = state
  if (deltaY < 0) {
    deltaY = 0
  } else if (deltaY > items.length * itemHeight - height) {
    deltaY = Math.max(items.length * itemHeight - height, 0)
  }
  if (state.deltaY === deltaY) {
    return state
  }
  const minLineY = Math.round(deltaY / itemHeight)
  const maxLineY = minLineY + Math.round(height / itemHeight)
  const visible = items.slice(minLineY, maxLineY)
  const { icons, newFileIconCache } = await GetFileIcons.getFileIcons(visible, state.fileIconCache)
  return {
    ...state,
    deltaY,
    minLineY,
    maxLineY,
    icons,
    fileIconCache: newFileIconCache,
  }
}
