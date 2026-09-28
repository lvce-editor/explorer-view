import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as DirentType from '../DirentType/DirentType.ts'
import * as FocusId from '../FocusId/FocusId.ts'
import * as GetFittingIndex from '../GetFittingIndex/GetFittingIndex.ts'
import * as GetNewDirentsForNewDirent from '../GetNewDirentsForNewDirent/GetNewDirentsForNewDirent.ts'
import * as GetNewDirentType from '../GetNewDirentType/GetNewDirentType.ts'
import { revealItemVisible } from '../RevealItemVisible/RevealItemVisible.ts'

export const newDirent = async (state: ExplorerState, editingType: number, editingIcon = ''): Promise<ExplorerState> => {
  const { applicationId } = state
  const { editingIndex, editingSessionId, excluded, focusedIndex, items, root } = state
  if (editingIndex !== -1) {
    return state
  }
  const index = GetFittingIndex.getFittingIndex(items, focusedIndex)
  const direntType = GetNewDirentType.getNewDirentType(editingType)
  const newDirents = await GetNewDirentsForNewDirent.getNewDirentsForNewDirent(
    items,
    index,
    direntType,
    root,
    excluded,
    focusedIndex === -1,
    applicationId,
  )
  const newEditingIndex = newDirents.findIndex((item) => item.type === DirentType.EditingFile || item.type === DirentType.EditingFolder)
  const newState = {
    ...state,
    editingIcon,
    editingIndex: newEditingIndex,
    editingSessionId: editingSessionId + 1,
    editingType,
    editingValue: '',
    focus: FocusId.Input,
    focusedIndex: newEditingIndex,
    items: newDirents,
  }
  const { deltaY, height, itemHeight } = newState
  const inputTop = newEditingIndex * itemHeight
  if (inputTop < deltaY || inputTop + itemHeight > deltaY + height) {
    return revealItemVisible(newState, newEditingIndex)
  }
  return newState
}
