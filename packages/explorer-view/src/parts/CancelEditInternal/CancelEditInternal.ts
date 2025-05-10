import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import { cancelEditCreate } from '../CancelEditCreate/CancelEditCreate.ts'
import { cancelEditRename } from '../CancelEditRename/CancelEditRename.ts'
import * as ExplorerEditingType from '../ExplorerEditingType/ExplorerEditingType.ts'

export const cancelEditInternal = (state: ExplorerState, keepFocus: boolean): ExplorerState => {
  const { editingType } = state
  if (editingType === ExplorerEditingType.Rename) {
    return cancelEditRename(state, keepFocus)
  }
  return cancelEditCreate(state, keepFocus)
}
