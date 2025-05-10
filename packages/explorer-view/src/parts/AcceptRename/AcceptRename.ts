import { VError } from '@lvce-editor/verror'
import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as CompareDirent from '../CompareDirent/CompareDirent.ts'
import * as ExplorerEditingType from '../ExplorerEditingType/ExplorerEditingType.ts'
import * as FileSystem from '../FileSystem/FileSystem.ts'
import * as FocusId from '../FocusId/FocusId.ts'
import * as Path from '../Path/Path.ts'
import { sortExplorerItems } from '../SortExplorerItems/SortExplorerItems.ts'

export const acceptRename = async (state: ExplorerState): Promise<ExplorerState> => {
  try {
    const { editingIndex, editingValue, items, pathSeparator } = state
    const renamedDirent = items[editingIndex]
    const oldAbsolutePath = renamedDirent.path
    const oldParentPath = Path.dirname(pathSeparator, oldAbsolutePath)
    const newAbsolutePath = Path.join2(oldParentPath, editingValue)

    // 1. Rename the file
    await FileSystem.rename(oldAbsolutePath, newAbsolutePath)

    // 2. Read the parent directory to get updated dirents
    const newDirents = await FileSystem.readDirWithFileTypes(oldParentPath)

    const sorted = sortExplorerItems(newDirents)

    // 3. Convert raw dirents to explorer items and sort them
    const explorerItems = sorted.map((dirent, index) => ({
      name: dirent.name,
      type: dirent.type,
      path: [oldParentPath, dirent.name].join(pathSeparator),
      depth: renamedDirent.depth,
      selected: false,
      posInSet: index + 1,
      setSize: newDirents.length,
      icon: '',
    }))

    // Find the index of the renamed item
    const focusedIndex = explorerItems.findIndex((dirent) => dirent.path === newAbsolutePath)

    // Update the items array, preserving any nested items
    const updatedItems = [...items]
    const startIndex = editingIndex
    let endIndex = editingIndex + 1
    while (endIndex < items.length && items[endIndex].depth > renamedDirent.depth) {
      endIndex++
    }

    // Replace the old items with the new sorted dirents
    updatedItems.splice(startIndex, endIndex - startIndex, ...explorerItems)

    return {
      ...state,
      editingIndex: -1,
      editingValue: '',
      editingType: ExplorerEditingType.None,
      editingIcon: '',
      focusedIndex,
      focused: true,
      focus: FocusId.List,
      items: updatedItems,
    }
  } catch (error) {
    console.error(new VError(error, `Failed to rename file`))
    return state
  }
}
