import * as ExplorerEditingType from '../ExplorerEditingType/ExplorerEditingType.ts'

export const resetEditing = {
  editingIndex: -1,
  editingValue: '',
  editingType: ExplorerEditingType.None,
  editingIcon: '',
  editingErrorMessage: '',
  editingSelection: {
    start: 0,
    end: 0,
  },
}
