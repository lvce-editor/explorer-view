import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as GetExplorerMaxLineY from '../GetExplorerMaxLineY/GetExplorerMaxLineY.ts'
import * as GetFileIcons from '../GetFileIcons/GetFileIcons.ts'
import { getTopLevelDirents } from '../GetTopLevelDirents/GetTopLevelDirents.ts'
import { mergeDirents } from '../MergeDirents/MergeDirents.ts'

// TODO add lots of tests for this
export const refresh = async (state: ExplorerState): Promise<ExplorerState> => {
  const { root, pathSeparator, minLineY, height, itemHeight, fileIconCache } = state
  const topLevelDirents = await getTopLevelDirents(root, pathSeparator, [])
  const newDirents = mergeDirents(state.items, topLevelDirents)
  const maxLineY = GetExplorerMaxLineY.getExplorerMaxLineY(minLineY, height, itemHeight, newDirents.length)
  const visible = newDirents.slice(minLineY, maxLineY)
  const { icons, newFileIconCache } = await GetFileIcons.getFileIcons(visible, fileIconCache)
  const state3: ExplorerState = {
    ...state,
    items: newDirents,
    fileIconCache: newFileIconCache,
    icons,
    maxLineY,
  }
  return state3
}
