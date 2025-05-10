import { VError } from '@lvce-editor/verror'
import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as CompareDirent from '../CompareDirent/CompareDirent.ts'
import { createTree } from '../CreateRenameMap/CreateRenameMap.ts'
import * as ExplorerEditingType from '../ExplorerEditingType/ExplorerEditingType.ts'
import * as FileSystem from '../FileSystem/FileSystem.ts'
import * as FocusId from '../FocusId/FocusId.ts'
import * as Path from '../Path/Path.ts'
import { treeToArray } from '../TreeToArray/TreeToArray.ts'

export const acceptRename = async (state: ExplorerState): Promise<ExplorerState> => {
  try {
    const { editingIndex, editingValue, items, pathSeparator, root } = state
    const renamedDirent = items[editingIndex]
    const oldAbsolutePath = renamedDirent.path
    const oldParentPath = Path.dirname(pathSeparator, oldAbsolutePath)
    const newAbsolutePath = [oldParentPath, editingValue].join(pathSeparator)

    // 1. Rename the file
    await FileSystem.rename(oldAbsolutePath, newAbsolutePath)

    // 2. Read the parent directory to get updated dirents
    const newDirents = await FileSystem.readDirWithFileTypes(oldParentPath)

    // 3. Convert raw dirents to explorer items and sort them
    const sortedDirents = newDirents
      .map((dirent, index) => ({
        name: dirent.name,
        type: dirent.type,
        path: [oldParentPath, dirent.name].join(pathSeparator),
        depth: renamedDirent.depth,
        selected: false,
        posInSet: index + 1,
        setSize: newDirents.length,
        icon: '',
      }))
      .sort(CompareDirent.compareDirent)

    // 4. Build a hashmap of items by path
    const map = {
      ...createTree(items),
      [oldParentPath]: sortedDirents,
    }

    // 5. Build the final items array using DFS
    const newItems = treeToArray(map, root)

    // Find the index of the renamed item
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
