import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as ExplorerEditingType from '../ExplorerEditingType/ExplorerEditingType.ts'
import * as FocusId from '../FocusId/FocusId.ts'
import * as GetFileIcons from '../GetFileIcons/GetFileIcons.ts'
import { isNormalItem } from '../IsNormalItem/IsNormalItem.ts'

export const cancelEditCreate = async (state: ExplorerState, keepFocus: boolean): Promise<ExplorerState> => {
  const { editingIndex, items, fileIconCache } = state
  const filteredItems = items.filter(isNormalItem)
  const { icons, newFileIconCache } = await GetFileIcons.getFileIcons(filteredItems, fileIconCache)
  return {
    ...state,
    items: filteredItems,
    focusedIndex: editingIndex,
    focused: keepFocus,
    editingIndex: -1,
    editingValue: '',
    editingErrorMessage: '',
    editingType: ExplorerEditingType.None,
    focus: FocusId.List,
    icons,
    fileIconCache: newFileIconCache,
  }
}
