import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as DirentType from '../DirentType/DirentType.ts'
import * as ExplorerEditingType from '../ExplorerEditingType/ExplorerEditingType.ts'
import * as FocusId from '../FocusId/FocusId.ts'
import { getNewDirentsForCancelRename } from '../GetNewDirentsForCancelRename/GetNewDirentsForCancelRename.ts'

const isNormalItem = (item: ExplorerItem): boolean => {
  return item.type !== DirentType.EditingFile && item.type !== DirentType.EditingFolder
}

export const cancelEdit = (state: ExplorerState): ExplorerState => {
  const { editingIndex, editingType, items } = state
  if (editingType === ExplorerEditingType.Rename) {
    const newItems = getNewDirentsForCancelRename(items, editingIndex)
    return {
      ...state,
      items: newItems,
      focusedIndex: editingIndex,
      focused: true,
      editingIndex: -1,
      editingValue: '',
      editingType: ExplorerEditingType.None,
      focus: FocusId.List,
    }
  }
  const filteredItems = items.filter(isNormalItem)
  return {
    ...state,
    items: filteredItems,
    focusedIndex: editingIndex,
    focused: true,
    editingIndex: -1,
    editingValue: '',
    editingType: ExplorerEditingType.None,
    focus: FocusId.List,
  }
}
