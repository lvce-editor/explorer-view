import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import { acceptEdit } from '../AcceptEdit/AcceptEdit.ts'
import { cancelEditInternal } from '../CancelEditInternal/CancelEditInternal.ts'
import * as InputSource from '../InputSource/InputSource.ts'

export const handleInputBlur = async (state: ExplorerState, editingSessionId?: string): Promise<ExplorerState> => {
  const { editingErrorMessage, editingIndex, editingSessionId: currentEditingSessionId, editingValue } = state
  if (editingIndex === -1) {
    return state
  }
  if (editingSessionId !== undefined && editingSessionId !== String(currentEditingSessionId)) {
    return state
  }
  if (editingErrorMessage || !editingValue) {
    return cancelEditInternal(state, false)
  }
  return acceptEdit(state, InputSource.User)
}
