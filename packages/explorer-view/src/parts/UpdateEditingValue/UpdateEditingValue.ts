import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as ExplorerEditingType from '../ExplorerEditingType/ExplorerEditingType.ts'
import { getEditingIcon } from '../GetEditingIcon/GetEditingIcon.ts'
import { getSiblingFileNames } from '../GetSiblingFileNames/GetSiblingFileNames.ts'
import * as InputSource from '../InputSource/InputSource.ts'
import { dirname } from '../Path/Path.ts'
import * as ValidateFileName2 from '../ValidateFileName2/ValidateFileName2.ts'

export const updateEditingValue = async (state: ExplorerState, value: string, inputSource: number = InputSource.User): Promise<ExplorerState> => {
  const { editingIndex, editingType, focusedIndex, items, pathSeparator, root } = state
  const editingIcon = await getEditingIcon(editingType, value, items[editingIndex]?.type)

  // Get sibling file names for validation during file/folder creation
  let siblingFileNames: readonly string[] = []
  if (editingType === ExplorerEditingType.CreateFile || editingType === ExplorerEditingType.CreateFolder) {
    siblingFileNames = getSiblingFileNames(items, focusedIndex, root, pathSeparator)
  } else if (editingType === ExplorerEditingType.Rename) {
    const editingItem = items[editingIndex]
    if (editingItem) {
      const parentPath = dirname(pathSeparator, editingItem.path)
      siblingFileNames = items
        .filter((item, index) => index !== editingIndex && dirname(pathSeparator, item.path) === parentPath)
        .map((item) => item.name)
    }
  }

  const editingErrorMessage = ValidateFileName2.validateFileName2(value, siblingFileNames)
  return {
    ...state,
    editingErrorMessage,
    editingIcon,
    editingValue: value,
  }
}
