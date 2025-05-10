import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as ExplorerEditingType from '../ExplorerEditingType/ExplorerEditingType.ts'
import * as FocusId from '../FocusId/FocusId.ts'
import { getNewDirentsForCancelRename } from '../GetNewDirentsForCancelRename/GetNewDirentsForCancelRename.ts'

export const cancelEditRename = (state: ExplorerState, keepFocus: boolean): ExplorerState => {
  const { editingIndex, items } = state
  const newItems = getNewDirentsForCancelRename(items, editingIndex)
  return {
    ...state,
    items: newItems,
    focusedIndex: editingIndex,
    focused: keepFocus,
    editingIndex: -1,
    editingValue: '',
    editingType: ExplorerEditingType.None,
    focus: FocusId.List,
  }
}
