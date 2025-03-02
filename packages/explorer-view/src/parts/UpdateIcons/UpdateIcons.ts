import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as GetFileIcons from '../GetFileIcons/GetFileIcons.ts'
import * as UpdateIcon from '../UpdateIcon/UpdateIcon.ts'

export const updateIcons = async (state: ExplorerState): Promise<ExplorerState> => {
  const newDirents = state.items.map(UpdateIcon.updateIcon)
  const { items, minLineY, maxLineY } = state
  const visible = items.slice(minLineY, maxLineY)
  const { icons, newFileIconCache } = await GetFileIcons.getFileIcons(visible, Object.create(null))
  return {
    ...state,
    items: newDirents,
    icons,
    fileIconCache: newFileIconCache,
  }
}
