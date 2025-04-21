import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as DirentType from '../DirentType/DirentType.ts'
import * as Focus from '../Focus/Focus.ts'
import * as FocusId from '../FocusId/FocusId.ts'
import * as FocusKey from '../FocusKey/FocusKey.ts'
import * as GetExplorerMaxLineY from '../GetExplorerMaxLineY/GetExplorerMaxLineY.ts'
import * as GetFileIcons from '../GetFileIcons/GetFileIcons.ts'
import * as GetNewDirentsForNewDirent from '../GetNewDirentsForNewDirent/GetNewDirentsForNewDirent.ts'
import * as GetNewDirentType from '../GetNewDirentType/GetNewDirentType.ts'

export const newDirent = async (state: ExplorerState, editingType: number): Promise<ExplorerState> => {
  // TODO make focus functional instead of side effect
  await Focus.setFocus(FocusKey.ExplorerEditBox)
  // TODO do it like vscode, select position between folders and files
  const { focusedIndex, items, minLineY, height, itemHeight, fileIconCache } = state
  const direntType = GetNewDirentType.getNewDirentType(editingType)
  const newDirents = await GetNewDirentsForNewDirent.getNewDirentsForNewDirent(items, focusedIndex, direntType)
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
