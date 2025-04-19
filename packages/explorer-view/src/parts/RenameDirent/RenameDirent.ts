import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as ExplorerEditingType from '../ExplorerEditingType/ExplorerEditingType.ts'
import * as FocusId from '../FocusId/FocusId.ts'

export const renameDirent = (state: ExplorerState): ExplorerState => {
  const { focusedIndex, items } = state
  const item = items[focusedIndex]
  return {
    ...state,
    editingIndex: focusedIndex,
    editingType: ExplorerEditingType.Rename,
    editingValue: item.name,
    focus: FocusId.Input,
  }
}
