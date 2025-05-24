import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as GetExplorerMaxLineY from '../GetExplorerMaxLineY/GetExplorerMaxLineY.ts'
import * as GetFileIcons from '../GetFileIcons/GetFileIcons.ts'
import * as IsTopLevel from '../IsTopLevel/IsTopLevel.ts'
import * as ToCollapsedDirent from '../ToCollapsedDirent/ToCollapsedDirent.ts'

export const collapseAll = async (state: ExplorerState): Promise<ExplorerState> => {
  const { minLineY, height, itemHeight, fileIconCache, items } = state

  const newDirents = items.filter(IsTopLevel.isTopLevel).map(ToCollapsedDirent.toCollapsedDirent)
  const dirents = newDirents
  const maxLineY = GetExplorerMaxLineY.getExplorerMaxLineY(minLineY, height, itemHeight, dirents.length)
  const visible = dirents.slice(minLineY, maxLineY)
  const { icons, newFileIconCache } = await GetFileIcons.getFileIcons(visible, fileIconCache)

  return {
    ...state,
    items: newDirents,
    icons,
    fileIconCache: newFileIconCache,
  }
}
