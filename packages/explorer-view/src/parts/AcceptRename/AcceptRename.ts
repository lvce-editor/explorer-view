import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as ComputeExplorerRenamedDirent from '../ComputeExplorerRenamedDirent/ComputeExplorerRenamedDirent.ts'
import { createNewDirentsRename } from '../CreateNewDirentsRename/CreateNewDirentsRename.ts'
import * as ExplorerEditingType from '../ExplorerEditingType/ExplorerEditingType.ts'
import * as FocusId from '../FocusId/FocusId.ts'

export const acceptRename = async (state: ExplorerState): Promise<ExplorerState> => {
  const { editingIndex, editingValue, items, pathSeparator } = state
  const renamedDirent = items[editingIndex]
  const successful = await createNewDirentsRename(renamedDirent, editingValue, pathSeparator)
  if (!successful) {
    return state
  }
  const { newDirents, focusedIndex } = ComputeExplorerRenamedDirent.computeExplorerRenamedDirent(items, editingIndex, editingValue)
  return {
    ...state,
    editingIndex: -1,
    editingValue: '',
    editingType: ExplorerEditingType.None,
    editingIcon: '',
    focusedIndex,
    focused: true,
    focus: FocusId.List,
    items: newDirents,
  }
}
