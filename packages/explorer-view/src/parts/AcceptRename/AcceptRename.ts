import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import { computeExplorerRenamedDirentUpdate } from '../ComputeExplorerRenamedDirentUpdate/ComputeExplorerRenamedDirentUpdate.ts'
import { createNewDirentsRename } from '../CreateNewDirentsRename/CreateNewDirentsRename.ts'
import { createTree } from '../CreateTree/CreateTree.ts'
import * as ExplorerEditingType from '../ExplorerEditingType/ExplorerEditingType.ts'
import * as FocusId from '../FocusId/FocusId.ts'
import * as GetExplorerMaxLineY from '../GetExplorerMaxLineY/GetExplorerMaxLineY.ts'
import * as GetFileIcons from '../GetFileIcons/GetFileIcons.ts'
import { getIndex } from '../GetIndex/GetIndex.ts'
import { dirname2, join2 } from '../Path/Path.ts'
import { treeToArray } from '../TreeToArray/TreeToArray.ts'
import { updateTree2 } from '../UpdateTree2/UpdateTree2.ts'

export const acceptRename = async (state: ExplorerState): Promise<ExplorerState> => {
  const { editingIndex, editingValue, items, pathSeparator, root, minLineY, height, itemHeight, fileIconCache } = state
  const renamedDirent = items[editingIndex]
  const successful = await createNewDirentsRename(renamedDirent, editingValue, pathSeparator)
  if (!successful) {
    return state
  }
  const dirname = dirname2(renamedDirent.path)
  const newUri = join2(dirname, editingValue)
  const update = await computeExplorerRenamedDirentUpdate(root, dirname, renamedDirent.depth - 1)
  const tree = createTree(items, root)
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
  }
}
