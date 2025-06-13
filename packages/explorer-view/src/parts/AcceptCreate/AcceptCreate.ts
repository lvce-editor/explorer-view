import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as ApplyFileOperations from '../ApplyFileOperations/ApplyFileOperations.ts'
import * as ExplorerEditingType from '../ExplorerEditingType/ExplorerEditingType.ts'
import * as FocusId from '../FocusId/FocusId.ts'
import * as GetFileOperationsCreate from '../GetFileOperationsCreate/GetFileOperationsCreate.ts'
import { getParentFolder } from '../GetParentFolder/GetParentFolder.ts'
import { join2 } from '../Path/Path.ts'
import { updateExplorerAfterFileOperations } from '../UpdateExplorerAfterFileOperations/UpdateExplorerAfterFileOperations.ts'
import * as ValidateFileName2 from '../ValidateFileName2/ValidateFileName2.ts'

export const acceptCreate = async (state: ExplorerState, newDirentType: number): Promise<ExplorerState> => {
  const { editingValue, pathSeparator, root, focusedIndex, items } = state
  const newFileName = editingValue
  const editingErrorMessage = ValidateFileName2.validateFileName2(newFileName)
  if (editingErrorMessage) {
    return {
      ...state,
      editingErrorMessage,
    }
  }
  const parentFolder = getParentFolder(items, focusedIndex, root)
  const absolutePath = join2(parentFolder, newFileName)
  const operations = GetFileOperationsCreate.getFileOperationsCreate(editingValue, newDirentType, pathSeparator, absolutePath, root)
  const createErrorMessage = await ApplyFileOperations.applyFileOperations(operations)
  if (createErrorMessage) {
    return {
      ...state,
      editingErrorMessage: createErrorMessage,
    }
  }

  const { newFileIconCache, newFocusedIndex, newIcons, newItems, newMaxLineY, newMinLineY } = await updateExplorerAfterFileOperations(
    state,
    operations,
    absolutePath,
  )

  return {
    ...state,
    items: newItems,
    icons: newIcons,
    focusedIndex: newFocusedIndex,
    minLineY: newMinLineY,
    maxLineY: newMaxLineY,
    fileIconCache: newFileIconCache,
    editingIndex: -1,
    editingType: ExplorerEditingType.None,
    focus: FocusId.List,
  }
}
