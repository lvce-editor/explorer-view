import * as ExplorerEditingType from '../ExplorerEditingType/ExplorerEditingType.ts'

export const renameDirent = (state: any): any => {
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
