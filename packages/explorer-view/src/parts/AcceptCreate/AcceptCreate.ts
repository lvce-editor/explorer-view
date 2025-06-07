import type { Create } from '../CreateNewDirentsAccept/CreateNewDirentsAccept.ts'
import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as ApplyFileOperations from '../ApplyFileOperations/ApplyFileOperations.ts'
import { createTree } from '../CreateTree/CreateTree.ts'
import * as ExplorerEditingType from '../ExplorerEditingType/ExplorerEditingType.ts'
import * as FocusId from '../FocusId/FocusId.ts'
import * as GetExplorerMaxLineY from '../GetExplorerMaxLineY/GetExplorerMaxLineY.ts'
import * as GetFileIcons from '../GetFileIcons/GetFileIcons.ts'
import * as GetFileOperationsCreate from '../GetFileOperationsCreate/GetFileOperationsCreate.ts'
import * as GetIndex from '../GetIndex/GetIndex.ts'
import { getParentFolder } from '../GetParentFolder/GetParentFolder.ts'
import { getPathParts } from '../GetPathParts/GetPathParts.ts'
import { getPathPartsChildren } from '../GetPathPartsChildren/GetPathPartsChildren.ts'
import { mergeTrees } from '../MergeTrees/MergeTrees.ts'
import { join2 } from '../Path/Path.ts'
import { treeToArray } from '../TreeToArray/TreeToArray.ts'
import * as ValidateFileName2 from '../ValidateFileName2/ValidateFileName2.ts'

export const acceptCreate = async (state: ExplorerState, newDirentType: number, createFn: Create): Promise<ExplorerState> => {
  const { editingValue, minLineY, height, itemHeight, fileIconCache, pathSeparator, root, focusedIndex, items } = state
  const newFileName = editingValue
  const editingErrorMessage = ValidateFileName2.validateFileName2(newFileName)
  if (editingErrorMessage) {
    return {
      ...state,
      editingErrorMessage,
    }
  }
  const parentFolder = getParentFolder(items, focusedIndex, root)
  const absolutePath = join2(parentFolder, newFileName)
  const operations = GetFileOperationsCreate.getFileOperationsCreate(editingValue, newDirentType, pathSeparator, absolutePath, root)
  const createErrorMessage = await ApplyFileOperations.applyFileOperations(operations)
  if (createErrorMessage) {
    return {
      ...state,
      editingErrorMessage: createErrorMessage,
    }
  }

  const pathPaths = getPathParts(root, absolutePath, pathSeparator)
  const children = await getPathPartsChildren(pathPaths)

  const tree = createTree(items, root)
  const childTree = createTree(children, root)
  const merged = mergeTrees(tree, childTree)

  const newItems = treeToArray(merged, root)

  const dirents = newItems
  const newFocusedIndex = GetIndex.getIndex(newItems, absolutePath)
  const maxLineY = GetExplorerMaxLineY.getExplorerMaxLineY(minLineY, height, itemHeight, dirents.length)
  const visible = dirents.slice(minLineY, maxLineY)
  const { icons, newFileIconCache } = await GetFileIcons.getFileIcons(visible, fileIconCache)

  return {
    ...state,
    items: dirents,
    editingIndex: -1,
    focusedIndex: newFocusedIndex,
    editingType: ExplorerEditingType.None,
    maxLineY,
    focus: FocusId.List,
    icons,
    fileIconCache: newFileIconCache,
  }
}
