import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as GetFileIcons from '../GetFileIcons/GetFileIcons.ts'

export const updateIcons = async (state: ExplorerState): Promise<ExplorerState> => {
  const { items, minLineY, maxLineY } = state
  const visible = items.slice(minLineY, maxLineY)
  const { icons, newFileIconCache } = await GetFileIcons.getFileIcons(visible, Object.create(null))
  return {
    ...state,
    icons,
    fileIconCache: newFileIconCache,
  }
}
