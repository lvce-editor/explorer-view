import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as ApplyFileOperations from '../ApplyFileOperations/ApplyFileOperations.ts'
import { computeExplorerRenamedDirentUpdate } from '../ComputeExplorerRenamedDirentUpdate/ComputeExplorerRenamedDirentUpdate.ts'
import { createTree } from '../CreateTree/CreateTree.ts'
import * as ExplorerEditingType from '../ExplorerEditingType/ExplorerEditingType.ts'
import * as FocusId from '../FocusId/FocusId.ts'
import { getChildDirents } from '../GetChildDirents/GetChildDirents.ts'
import * as GetFileOperationsRename from '../GetFileOperationsRename/GetFileOperationsRename.ts'
import { getIndex } from '../GetIndex/GetIndex.ts'
import { getRenameSiblingFileNames } from '../GetRenameSiblingFileNames/GetRenameSiblingFileNames.ts'
import { dirname2, join2 } from '../Path/Path.ts'
import { treeToArray } from '../TreeToArray/TreeToArray.ts'
import { updateTree2 } from '../UpdateTree2/UpdateTree2.ts'
import * as ValidateFileName2 from '../ValidateFileName2/ValidateFileName2.ts'

export const acceptRename = async (state: ExplorerState): Promise<ExplorerState> => {
  const { editingIndex, editingValue, excluded, items, pathSeparator, root } = state
  const siblingFileNames = getRenameSiblingFileNames(items, editingIndex, pathSeparator)
  const editingErrorMessage = ValidateFileName2.validateFileName2(editingValue, siblingFileNames)
  if (editingErrorMessage) {
    return {
      ...state,
      editingErrorMessage,
    }
  }
  const renamedDirent = items[editingIndex]
  const oldUri = renamedDirent.path
  const dirname = dirname2(oldUri)
  const newUri = join2(dirname, editingValue)
  const operations = GetFileOperationsRename.getFileOperationsRename(renamedDirent.path, editingValue)
  const renameErrorMessage = await ApplyFileOperations.applyFileOperations(operations)
  if (renameErrorMessage) {
    return {
      ...state,
      editingErrorMessage: renameErrorMessage,
    }
  }
  const children = await getChildDirents(pathSeparator, dirname, renamedDirent.depth - 1, excluded, root)
  const tree = createTree(items, root)
  const update = computeExplorerRenamedDirentUpdate(root, dirname, oldUri, children, tree, newUri)
  const newTree = updateTree2(tree, update)
  const newDirents = treeToArray(newTree, root)
  const newFocusedIndex = getIndex(newDirents, newUri)
  return {
    ...state,
    editingIcon: '',
    editingIndex: -1,
    editingSelectionEnd: 0,
    editingSelectionStart: 0,
    editingType: ExplorerEditingType.None,
    editingValue: '',
    focus: FocusId.List,
    focused: true,
    focusedIndex: newFocusedIndex,
    items: newDirents,
  }
}
