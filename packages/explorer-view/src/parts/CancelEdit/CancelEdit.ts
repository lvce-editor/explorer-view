import * as ExplorerEditingType from '../ExplorerEditingType/ExplorerEditingType.ts'

export const cancelEdit = (state: any): any => {
  const { editingIndex } = state
  return {
    ...state,
    focusedIndex: editingIndex,
    focused: true,
    editingIndex: -1,
    editingValue: '',
    editingType: ExplorerEditingType.None,
  }
}
