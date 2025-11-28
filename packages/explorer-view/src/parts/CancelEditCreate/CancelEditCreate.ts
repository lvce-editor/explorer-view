import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as ExplorerEditingType from '../ExplorerEditingType/ExplorerEditingType.ts'
import * as FocusId from '../FocusId/FocusId.ts'
import { getFocusedIndexCancel } from '../GetFocusedIndexCancel/GetFocusedIndexCancel.ts'
import { isNormalItem } from '../IsNormalItem/IsNormalItem.ts'

export const cancelEditCreate = async (state: ExplorerState, keepFocus: boolean): Promise<ExplorerState> => {
  const { editingIndex, items } = state
  const filteredItems = items.filter(isNormalItem)
  const newFocusedIndex = getFocusedIndexCancel(items, editingIndex)
  return {
    ...state,
    items: filteredItems,
    focusedIndex: newFocusedIndex,
    focused: keepFocus,
    editingIndex: -1,
    editingValue: '',
    editingErrorMessage: '',
    editingType: ExplorerEditingType.None,
    focus: FocusId.List,
  }
}
