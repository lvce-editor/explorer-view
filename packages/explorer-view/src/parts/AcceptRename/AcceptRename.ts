import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as ApplyFileOperations from '../ApplyFileOperations/ApplyFileOperations.ts'
import * as ExplorerEditingType from '../ExplorerEditingType/ExplorerEditingType.ts'
import * as FocusId from '../FocusId/FocusId.ts'
import * as GetFileOperationsRename from '../GetFileOperationsRename/GetFileOperationsRename.ts'
import { dirname2, join2 } from '../Path/Path.ts'
import { updateExplorerAfterFileOperations } from '../UpdateExplorerAfterFileOperations/UpdateExplorerAfterFileOperations.ts'
import * as ValidateFileName2 from '../ValidateFileName2/ValidateFileName2.ts'

export const acceptRename = async (state: ExplorerState): Promise<ExplorerState> => {
  const { editingIndex, editingValue, items } = state
  const editingErrorMessage = ValidateFileName2.validateFileName2(editingValue)
  if (editingErrorMessage) {
    return {
      ...state,
      editingErrorMessage,
    }
  }
  const renamedDirent = items[editingIndex]
  const operations = GetFileOperationsRename.getFileOperationsRename(renamedDirent.path, editingValue)
  const renameErrorMessage = await ApplyFileOperations.applyFileOperations(operations)
  if (renameErrorMessage) {
    return {
      ...state,
      editingErrorMessage: renameErrorMessage,
    }
  }
  const oldUri = renamedDirent.path
  const dirname = dirname2(oldUri)
  const newUri = join2(dirname, editingValue)
  const { newFileIconCache, newFocusedIndex, newIcons, newItems, newMaxLineY, newMinLineY } = await updateExplorerAfterFileOperations(
    state,
    operations,
    newUri,
  )
  return {
    ...state,
    editingIcon: '',
    editingIndex: -1,
    editingSelectionEnd: 0,
    editingSelectionStart: 0,
    editingType: ExplorerEditingType.None,
    editingValue: '',
    fileIconCache: newFileIconCache,
    focus: FocusId.List,
    focused: true,
    focusedIndex: newFocusedIndex,
    icons: newIcons,
    items: newItems,
    maxLineY: newMaxLineY,
    minLineY: newMinLineY,
  }
}
