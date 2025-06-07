import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as ApplyFileOperations from '../ApplyFileOperations/ApplyFileOperations.ts'
import { computeExplorerRenamedDirentUpdate } from '../ComputeExplorerRenamedDirentUpdate/ComputeExplorerRenamedDirentUpdate.ts'
import { createTree } from '../CreateTree/CreateTree.ts'
import * as ExplorerEditingType from '../ExplorerEditingType/ExplorerEditingType.ts'
import * as FocusId from '../FocusId/FocusId.ts'
import { getChildDirents } from '../GetChildDirents/GetChildDirents.ts'
import * as GetExplorerMaxLineY from '../GetExplorerMaxLineY/GetExplorerMaxLineY.ts'
import * as GetFileIcons from '../GetFileIcons/GetFileIcons.ts'
import * as GetFileOperationsRename from '../GetFileOperationsRename/GetFileOperationsRename.ts'
import { getIndex } from '../GetIndex/GetIndex.ts'
import { dirname2, join2 } from '../Path/Path.ts'
import { treeToArray } from '../TreeToArray/TreeToArray.ts'
import { updateTree2 } from '../UpdateTree2/UpdateTree2.ts'
import * as ValidateFileName2 from '../ValidateFileName2/ValidateFileName2.ts'

export const acceptRename = async (state: ExplorerState): Promise<ExplorerState> => {
  const { editingIndex, editingValue, items, root, minLineY, height, itemHeight, fileIconCache } = state
  const editingErrorMessage = ValidateFileName2.validateFileName2(editingValue)
  if (editingErrorMessage) {
    return {
      ...state,
      editingErrorMessage,
    }
  }
  const renamedDirent = items[editingIndex]
  const operations = GetFileOperationsRename.getFileOperationsRename(renamedDirent.path, editingValue)
  const renameErrorMessage = await ApplyFileOperations.applyFileOperations(operations)
  if (renameErrorMessage) {
    return {
      ...state,
      editingErrorMessage: renameErrorMessage,
    }
  }
  const oldUri = renamedDirent.path
  const dirname = dirname2(oldUri)
  const newUri = join2(dirname, editingValue)
  const children = await getChildDirents('/', dirname, renamedDirent.depth - 1, [])
  const tree = createTree(items, root)
  const update = computeExplorerRenamedDirentUpdate(root, dirname, oldUri, children, tree, newUri)
  const newTree = updateTree2(tree, update)
  const newDirents = treeToArray(newTree, root)
  const newFocusedIndex = getIndex(newDirents, newUri)
  const maxLineY = GetExplorerMaxLineY.getExplorerMaxLineY(minLineY, height, itemHeight, newDirents.length)
  const visible = newDirents.slice(minLineY, maxLineY)
  const { icons, newFileIconCache } = await GetFileIcons.getFileIcons(visible, fileIconCache)
  return {
    ...state,
    editingIndex: -1,
    editingValue: '',
    editingType: ExplorerEditingType.None,
    editingIcon: '',
    focusedIndex: newFocusedIndex,
    focused: true,
    focus: FocusId.List,
    items: newDirents,
    icons,
    fileIconCache: newFileIconCache,
    editingSelectionEnd: 0,
    editingSelectionStart: 0,
  }
}
