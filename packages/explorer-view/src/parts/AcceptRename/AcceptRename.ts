import { VError } from '@lvce-editor/verror'
import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as ComputeExplorerRenamedDirent from '../ComputeExplorerRenamedDirent/ComputeExplorerRenamedDirent.ts'
import * as ExplorerEditingType from '../ExplorerEditingType/ExplorerEditingType.ts'
import * as FileSystem from '../FileSystem/FileSystem.ts'
import * as FocusId from '../FocusId/FocusId.ts'
import * as Path from '../Path/Path.ts'

export const acceptRename = async (state: ExplorerState): Promise<ExplorerState> => {
  const { editingIndex, editingValue, items, pathSeparator } = state
  const renamedDirent = items[editingIndex]
  try {
    // TODO this does not work with rename of nested file
    const oldAbsolutePath = renamedDirent.path
    const oldParentPath = Path.dirname(pathSeparator, oldAbsolutePath)
    const newAbsolutePath = Path.join2(oldParentPath, editingValue)
    await FileSystem.rename(oldAbsolutePath, newAbsolutePath)
  } catch (error) {
    console.error(new VError(error, `Failed to rename file`))
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
