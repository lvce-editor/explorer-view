import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as DirentType from '../DirentType/DirentType.ts'
import * as FocusId from '../FocusId/FocusId.ts'
import * as GetExplorerMaxLineY from '../GetExplorerMaxLineY/GetExplorerMaxLineY.ts'
import * as GetNewDirentsForNewDirent from '../GetNewDirentsForNewDirent/GetNewDirentsForNewDirent.ts'
import * as GetNewDirentType from '../GetNewDirentType/GetNewDirentType.ts'
import * as GetVisibleExplorerItems from '../GetVisibleExplorerItems/GetVisibleExplorerItems.ts'

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
  // TODO do it like vscode, select position between folders and files
  const { minLineY, height, itemHeight, root, focusedIndex, items } = state
  const index = getFittingIndex(items, focusedIndex)
  const direntType = GetNewDirentType.getNewDirentType(editingType)
  const newDirents = await GetNewDirentsForNewDirent.getNewDirentsForNewDirent(items, index, direntType, root)
  const maxLineY = GetExplorerMaxLineY.getExplorerMaxLineY(minLineY, height, itemHeight, newDirents.length)
  const editingIndex = newDirents.findIndex((item) => item.type === DirentType.EditingFile || item.type === DirentType.EditingFolder)
  return {
    ...state,
    editingIndex,
    editingType,
    editingValue: '',
    focus: FocusId.Input,
    focusedIndex: editingIndex,
    items: newDirents,
    maxLineY,
  }
}
