import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as ApplicationRpc from '../ApplicationRpc/ApplicationRpc.ts'
import * as ApplyFileOperations from '../ApplyFileOperations/ApplyFileOperations.ts'
import { createTree } from '../CreateTree/CreateTree.ts'
import * as DirentType from '../DirentType/DirentType.ts'
import * as ExplorerEditingType from '../ExplorerEditingType/ExplorerEditingType.ts'
import * as FocusId from '../FocusId/FocusId.ts'
import * as GetFileOperationsCreate from '../GetFileOperationsCreate/GetFileOperationsCreate.ts'
import * as GetIndex from '../GetIndex/GetIndex.ts'
import { getParentFolder } from '../GetParentFolder/GetParentFolder.ts'
import { getPathParts } from '../GetPathParts/GetPathParts.ts'
import { getPathPartsChildren } from '../GetPathPartsChildren/GetPathPartsChildren.ts'
import { getSiblingFileNames } from '../GetSiblingFileNames/GetSiblingFileNames.ts'
import { mergeTrees } from '../MergeTrees/MergeTrees.ts'
import { openUri } from '../OpenUri/OpenUri.ts'
import { join2 } from '../Path/Path.ts'
import { refreshWorkspace } from '../RefreshWorkspace/RefreshWorkspace.ts'
import * as RendererProcess from '../RendererProcess/RendererProcess.ts'
import { treeToArray } from '../TreeToArray/TreeToArray.ts'
import * as ValidateFileName2 from '../ValidateFileName2/ValidateFileName2.ts'

const focusEditorAfterExplorerRender = (applicationId?: string): void => {
  setTimeout(() => {
    void ApplicationRpc.invoke(applicationId, 'Main.focus').catch(() => {})
  }, 0)
}

const openCreatedFile = async (absolutePath: string, applicationId?: string): Promise<void> => {
  await openUri(absolutePath, true, undefined, applicationId)
  focusEditorAfterExplorerRender(applicationId)
}

const finishCreate = async (absolutePath: string, newDirentType: number, applicationId?: string): Promise<void> => {
  await refreshWorkspace(applicationId)
  if (newDirentType === DirentType.File) {
    await openCreatedFile(absolutePath, applicationId)
  }
}

export const acceptCreate = async (state: ExplorerState, newDirentType: number): Promise<ExplorerState> => {
  const { applicationId } = state
  const { editingValue, excluded, focusedIndex, items, pathSeparator, root, uid } = state
  const newFileName = editingValue
  const siblingFileNames = getSiblingFileNames(items, focusedIndex, root, pathSeparator)
  const editingErrorMessage = ValidateFileName2.validateFileName2(newFileName, siblingFileNames)
  if (editingErrorMessage) {
    return {
      ...state,
      editingErrorMessage,
    }
  }
  const parentFolder = getParentFolder(items, focusedIndex, root, pathSeparator)
  const absolutePath = join2(parentFolder, newFileName)
  const operations = GetFileOperationsCreate.getFileOperationsCreate(editingValue, newDirentType, pathSeparator, absolutePath, root)
  const createErrorMessage = await ApplyFileOperations.applyFileOperations(operations, applicationId)
  if (createErrorMessage) {
    return {
      ...state,
      editingErrorMessage: createErrorMessage,
    }
  }

  const pathPaths = getPathParts(root, absolutePath, pathSeparator)
  const children = await getPathPartsChildren(pathPaths, excluded, root, applicationId)

  const tree = createTree(items, root)
  const childTree = createTree(children, root)
  const merged = mergeTrees(tree, childTree)

  const newItems = treeToArray(merged, root)

  const dirents = newItems
  const newFocusedIndex = GetIndex.getIndex(newItems, absolutePath)

  if (RendererProcess.isConnected()) {
    if (newDirentType === DirentType.File) {
      await openUri(absolutePath, true, undefined, applicationId)
      RendererProcess.requestPostRenderFocus(uid)
    }
  } else {
    await finishCreate(absolutePath, newDirentType, applicationId)
  }

  return {
    ...state,
    editingIndex: -1,
    editingType: ExplorerEditingType.None,
    focus: newDirentType === DirentType.File ? FocusId.None : FocusId.List,
    focusedIndex: newFocusedIndex,
    items: dirents,
  }
}
