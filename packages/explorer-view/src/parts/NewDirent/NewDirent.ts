import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as DirentType from '../DirentType/DirentType.ts'
import * as FocusId from '../FocusId/FocusId.ts'
import * as GetExplorerMaxLineY from '../GetExplorerMaxLineY/GetExplorerMaxLineY.ts'
import * as GetFileIcons from '../GetFileIcons/GetFileIcons.ts'
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
  const {
    minLineY,
    height,
    itemHeight,
    root,
    fileIconCache,
    cutItems,
    sourceControlIgnoredUris,
    dropTargets,
    editingErrorMessage,
    editingIcon,
    editingValue,
    focusedIndex,
    items,
    useChevrons,
  } = state
  const index = getFittingIndex(items, focusedIndex)
  const direntType = GetNewDirentType.getNewDirentType(editingType)
  const newDirents = await GetNewDirentsForNewDirent.getNewDirentsForNewDirent(items, index, direntType, root)
  const maxLineY = GetExplorerMaxLineY.getExplorerMaxLineY(minLineY, height, itemHeight, newDirents.length)
  const visible = newDirents.slice(minLineY, maxLineY)
  const { icons, newFileIconCache } = await GetFileIcons.getFileIcons(visible, fileIconCache)
  const editingIndex = newDirents.findIndex((item) => item.type === DirentType.EditingFile || item.type === DirentType.EditingFolder)
  const visibleExplorerItems = GetVisibleExplorerItems.getVisibleExplorerItems(
    items,
    minLineY,
    maxLineY,
    focusedIndex,
    editingIndex,
    editingType,
    editingValue,
    editingErrorMessage,
    icons,
    useChevrons,
    dropTargets,
    editingIcon,
    cutItems,
    sourceControlIgnoredUris,
  )
  return {
    ...state,
    editingIndex,
    editingType,
    editingValue: '',
    fileIconCache: newFileIconCache,
    focus: FocusId.Input,
    focusedIndex: editingIndex,
    icons,
    items: newDirents,
    maxLineY,
    visibleExplorerItems,
  }
}
