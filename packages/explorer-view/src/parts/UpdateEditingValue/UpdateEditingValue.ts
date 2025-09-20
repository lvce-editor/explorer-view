import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as ExplorerEditingType from '../ExplorerEditingType/ExplorerEditingType.ts'
import { getEditingIcon } from '../GetEditingIcon/GetEditingIcon.ts'
import { getSiblingFileNames } from '../GetSiblingFileNames/GetSiblingFileNames.ts'
import * as InputSource from '../InputSource/InputSource.ts'
import * as ValidateFileName2 from '../ValidateFileName2/ValidateFileName2.ts'

export const updateEditingValue = async (state: ExplorerState, value: string, inputSource: number = InputSource.User): Promise<ExplorerState> => {
  const { editingType, items, editingIndex, pathSeparator, root, focusedIndex } = state
  const editingIcon = await getEditingIcon(editingType, value, items[editingIndex]?.type)

  // Get sibling file names for validation during file/folder creation
  let siblingFileNames: readonly string[] = []
  if (editingType === ExplorerEditingType.CreateFile || editingType === ExplorerEditingType.CreateFolder) {
    siblingFileNames = getSiblingFileNames(items, focusedIndex, root, pathSeparator)
  }

  const editingErrorMessage = ValidateFileName2.validateFileName2(value, siblingFileNames)
  return {
    ...state,
    editingValue: value,
    editingIcon,
    editingErrorMessage,
  }
}
