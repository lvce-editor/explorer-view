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
    const newAbsolutePath = [oldParentPath, editingValue].join(pathSeparator)
    await FileSystem.rename(oldAbsolutePath, newAbsolutePath)
  } catch {
    // TODO
    // await ErrorHandling.showErrorDialog(error)
    return state
  }
  const { newDirents, focusedIndex } = ComputeExplorerRenamedDirent.computeExplorerRenamedDirent(items, editingIndex, editingValue)
  //  TODO move focused index
  // @ts-ignore
  state.items = newDirents
  return {
    ...state,
    editingIndex: -1,
    editingValue: '',
    editingType: ExplorerEditingType.None,
    editingIcon: '',
    focusedIndex,
    focused: true,
    focus: FocusId.List,
  }
}
