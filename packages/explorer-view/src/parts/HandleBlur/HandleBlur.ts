import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import { acceptEdit } from '../AcceptEdit/AcceptEdit.ts'
import * as ExplorerEditingType from '../ExplorerEditingType/ExplorerEditingType.ts'
import { cancelEditInternal } from '../CancelEditInternal/CancelEditInternal.ts'

export const handleBlur = async (state: ExplorerState): Promise<ExplorerState> => {
  // TODO when blur event occurs because of context menu, focused index should stay the same
  // but focus outline should be removed
  const { editingType, editingErrorMessage, editingValue } = state
  if (editingType === ExplorerEditingType.None) {
    return {
      ...state,
      focused: false,
    }
  }
  if (editingErrorMessage || !editingValue) {
    return cancelEditInternal(state, false)
  }
  return acceptEdit(state)
}
