import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as ExplorerEditingType from '../ExplorerEditingType/ExplorerEditingType.ts'
import * as FocusId from '../FocusId/FocusId.ts'
import { isNormalItem } from '../IsNormalItem/IsNormalItem.ts'

export const cancelEditCreate = (state: ExplorerState, keepFocus: boolean): ExplorerState => {
  const { editingIndex, items } = state
  const filteredItems = items.filter(isNormalItem)
  return {
    ...state,
    items: filteredItems,
    focusedIndex: editingIndex,
    focused: keepFocus,
    editingIndex: -1,
    editingValue: '',
    editingType: ExplorerEditingType.None,
    focus: FocusId.List,
  }
}
