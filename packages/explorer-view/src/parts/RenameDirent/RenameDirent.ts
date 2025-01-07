import type { ExplorerState } from '../EXplorerState/ExplorerState.ts'
import * as ExplorerEditingType from '../ExplorerEditingType/ExplorerEditingType.ts'

export const renameDirent = (state: ExplorerState): ExplorerState => {
  const { focusedIndex, items } = state
  const item = items[focusedIndex]
  // Focus.setFocus(FocusKey.ExplorerEditBox)
  return {
    ...state,
    editingIndex: focusedIndex,
    editingType: ExplorerEditingType.Rename,
    editingValue: item.name,
  }
}
