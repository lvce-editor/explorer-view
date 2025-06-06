import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as DirentType from '../DirentType/DirentType.ts'
import * as FocusId from '../FocusId/FocusId.ts'
import * as FocusKey from '../FocusKey/FocusKey.ts'
import * as GetExplorerMaxLineY from '../GetExplorerMaxLineY/GetExplorerMaxLineY.ts'
import * as GetFileIcons from '../GetFileIcons/GetFileIcons.ts'
import * as GetNewDirentsForNewDirent from '../GetNewDirentsForNewDirent/GetNewDirentsForNewDirent.ts'
import * as GetNewDirentType from '../GetNewDirentType/GetNewDirentType.ts'
import * as SetFocus from '../SetFocus/SetFocus.ts'

const isFolder = (direntType: number): boolean => {
  return direntType === DirentType.Directory || direntType === DirentType.DirectoryExpanded || direntType === DirentType.SymLinkFolder
}

const getFittingIndex = (dirents: readonly ExplorerItem[], startIndex: number): number => {
  for (let i = startIndex; i >= 0; i--) {
    const dirent = dirents[i]
    if (isFolder(dirent.type)) {
      return i
    }
  }
  return -1
}

export const newDirent = async (state: ExplorerState, editingType: number): Promise<ExplorerState> => {
  // TODO make focus functional instead of side effect
  await SetFocus.setFocus(FocusKey.ExplorerEditBox)
  // TODO do it like vscode, select position between folders and files
  const { focusedIndex, items, minLineY, height, itemHeight, fileIconCache, root } = state
  const index = getFittingIndex(items, focusedIndex)
  const direntType = GetNewDirentType.getNewDirentType(editingType)
  const newDirents = await GetNewDirentsForNewDirent.getNewDirentsForNewDirent(items, index, direntType, root)
  const maxLineY = GetExplorerMaxLineY.getExplorerMaxLineY(minLineY, height, itemHeight, newDirents.length)
  const visible = newDirents.slice(minLineY, maxLineY)
  const { icons, newFileIconCache } = await GetFileIcons.getFileIcons(visible, fileIconCache)
  const editingIndex = newDirents.findIndex((item) => item.type === DirentType.EditingFile || item.type === DirentType.EditingFolder)
  return {
    ...state,
    items: newDirents,
    editingIndex,
    editingType,
    editingValue: '',
    focusedIndex: editingIndex,
    focus: FocusId.Input,
    icons,
    fileIconCache: newFileIconCache,
    maxLineY,
  }
}
