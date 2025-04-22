import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as ExplorerEditingType from '../ExplorerEditingType/ExplorerEditingType.ts'
import * as FocusId from '../FocusId/FocusId.ts'
import { getNewDirentsForRename } from '../GetNewDirentsForRename/GetNewDirentsForRename.ts'
import * as InputSource from '../InputSource/InputSource.ts'

export const renameDirent = (state: ExplorerState): ExplorerState => {
  const { focusedIndex, items, icons, minLineY } = state
  if (items.length === 0) {
    return state
  }
  const item = items[focusedIndex]
  const newItems = getNewDirentsForRename(items, focusedIndex)
  return {
    ...state,
    items: newItems,
    editingIndex: focusedIndex,
    editingType: ExplorerEditingType.Rename,
    editingValue: item.name,
    editingIcon: icons[focusedIndex - minLineY],
    focus: FocusId.Input,
    inputSource: InputSource.Script,
  }
}
