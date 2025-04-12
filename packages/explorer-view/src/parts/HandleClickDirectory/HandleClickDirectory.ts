import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as DirentType from '../DirentType/DirentType.ts'
import * as GetChildDirents from '../GetChildDirents/GetChildDirents.ts'
import * as GetExplorerMaxLineY from '../GetExplorerMaxLineY/GetExplorerMaxLineY.ts'
import * as GetFileIcons from '../GetFileIcons/GetFileIcons.ts'

export const handleClickDirectory = async (state: ExplorerState, dirent: ExplorerItem, index: number, keepFocus: boolean): Promise<ExplorerState> => {
  // @ts-ignore
  dirent.type = DirentType.DirectoryExpanding
  // TODO handle error
  const dirents = await GetChildDirents.getChildDirents(state.pathSeparator, dirent)
  const state2 = state
  if (!state2) {
    return state
  }
  // TODO use Viewlet.getState here and check if it exists
  const newIndex = state2.items.indexOf(dirent)
  // TODO if viewlet is disposed or root has changed, return
  if (newIndex === -1) {
    return state
  }
  const newDirents = [...state2.items]
  newDirents.splice(newIndex + 1, 0, ...dirents)
  // @ts-ignore
  dirent.type = DirentType.DirectoryExpanded
  // @ts-ignore
  dirent.icon = ''
  const { height, itemHeight, minLineY } = state2
  // TODO when focused index has changed while expanding, don't update it
  const maxLineY = GetExplorerMaxLineY.getExplorerMaxLineY(minLineY, height, itemHeight, newDirents.length)

  const parts = newDirents.slice(minLineY, maxLineY)
  const { icons, newFileIconCache } = await GetFileIcons.getFileIcons(parts, state.fileIconCache)
  return {
    ...state,
    items: newDirents,
    icons,
    fileIconCache: newFileIconCache,
    focusedIndex: newIndex,
    focused: keepFocus,
    maxLineY,
  }
}
