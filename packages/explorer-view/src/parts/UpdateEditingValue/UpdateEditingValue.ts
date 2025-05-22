import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import { getEditingIcon } from '../GetEditingIcon/GetEditingIcon.ts'
import * as InputSource from '../InputSource/InputSource.ts'
import * as ValidateFileName2 from '../ValidateFileName2/ValidateFileName2.ts'

export const updateEditingValue = async (state: ExplorerState, value: string, inputSource: number = InputSource.User): Promise<ExplorerState> => {
  const { editingType, items, editingIndex } = state
  const editingIcon = await getEditingIcon(editingType, value, items[editingIndex]?.type)
  const editingErrorMessage = ValidateFileName2.validateFileName2(value)
  return {
    ...state,
    editingValue: value,
    editingIcon,
    editingErrorMessage,
  }
}
