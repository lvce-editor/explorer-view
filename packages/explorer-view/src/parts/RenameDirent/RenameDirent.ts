import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as ExplorerEditingType from '../ExplorerEditingType/ExplorerEditingType.ts'
import * as FocusId from '../FocusId/FocusId.ts'
import { getNewDirentsForRename } from '../GetNewDirentsForRename/GetNewDirentsForRename.ts'
import { getRenameSelectionRange } from '../GetRenameSelectionRange/GetRenameSelectionRange.ts'
import * as InputSource from '../InputSource/InputSource.ts'

export const renameDirent = async (state: ExplorerState): Promise<ExplorerState> => {
  const { focusedIndex, items, icons, minLineY } = state
  if (items.length === 0) {
    return state
  }
  const item = items[focusedIndex]
  const newItems = getNewDirentsForRename(items, focusedIndex)
  const { start, end } = getRenameSelectionRange(item.name)
  return {
    ...state,
    items: newItems,
    editingIndex: focusedIndex,
    editingType: ExplorerEditingType.Rename,
    editingValue: item.name,
    editingIcon: icons[focusedIndex - minLineY],
    editingSelectionStart: start,
    editingSelectionEnd: end,
    focus: FocusId.Input,
    inputSource: InputSource.Script,
  }
}
