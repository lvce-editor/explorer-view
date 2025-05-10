import { VError } from '@lvce-editor/verror'
import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as ExplorerEditingType from '../ExplorerEditingType/ExplorerEditingType.ts'
import * as FileSystem from '../FileSystem/FileSystem.ts'
import * as FocusId from '../FocusId/FocusId.ts'
import * as Path from '../Path/Path.ts'
import { updateDirentsAtPath } from '../UpdateDirentsAtPath/UpdateDirentsAtPath.ts'

export const acceptRename = async (state: ExplorerState): Promise<ExplorerState> => {
  try {
    const { editingIndex, editingValue, items, pathSeparator, root } = state
    const renamedDirent = items[editingIndex]
    const oldAbsolutePath = renamedDirent.path
    const oldParentPath = Path.dirname(pathSeparator, oldAbsolutePath)
    const newAbsolutePath = [oldParentPath, editingValue].join(pathSeparator)
    await FileSystem.rename(oldAbsolutePath, newAbsolutePath)
    const newDirents = await FileSystem.readDirWithFileTypes(oldParentPath)
    const newItems = updateDirentsAtPath(items, oldParentPath, root, newDirents)
    const focusedIndex = newItems.findIndex((item) => item.path === newAbsolutePath)
    return {
      ...state,
      editingIndex: -1,
      editingValue: '',
      editingType: ExplorerEditingType.None,
      editingIcon: '',
      focusedIndex,
      focused: true,
      focus: FocusId.List,
      items: newItems,
    }
  } catch (error) {
    console.error(new VError(error, `Failed to rename file`))
    return state
  }
}
