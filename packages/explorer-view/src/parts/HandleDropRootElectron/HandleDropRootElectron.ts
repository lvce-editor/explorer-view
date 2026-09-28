import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as ApplicationRpc from '../ApplicationRpc/ApplicationRpc.ts'
import { copyFilesElectron } from '../CopyFilesElectron/CopyFilesElectron.ts'
import * as GetChildDirents from '../GetChildDirents/GetChildDirents.ts'
import { isDirectoryHandle } from '../IsDirectoryHandle/IsDirectoryHandle.ts'
import * as LoadContent from '../LoadContent/LoadContent.ts'

const mergeDirents = (oldDirents: readonly ExplorerItem[], newDirents: readonly ExplorerItem[]): any => {
  return newDirents
}

const getMergedDirents = async (root: any, pathSeparator: any, dirents: any, excluded: readonly string[], applicationId?: string): Promise<any> => {
  const childDirents = await GetChildDirents.getChildDirents(pathSeparator, root, 0, excluded, root, applicationId)
  const mergedDirents = mergeDirents(dirents, childDirents)
  return mergedDirents
}

const openDroppedDirectoryAsWorkspace = async (state: ExplorerState, path: string): Promise<ExplorerState> => {
  const { applicationId } = state
  await ApplicationRpc.invoke(applicationId, 'Workspace.setPath', path)
  const updated = await LoadContent.loadContent(state, undefined)
  return {
    ...updated,
    dropTargets: [],
  }
}

const getFirstDroppedDirectoryPath = (
  state: ExplorerState,
  fileHandles: readonly FileSystemHandle[],
  paths: readonly string[],
): string | undefined => {
  const { root } = state
  if (root !== '') {
    return undefined
  }
  for (let i = 0; i < fileHandles.length; i++) {
    const fileHandle = fileHandles[i]
    if (isDirectoryHandle(fileHandle)) {
      return paths[i]
    }
  }
  return undefined
}

export const handleDrop = async (
  state: ExplorerState,
  fileHandles: readonly FileSystemHandle[],
  paths: readonly string[],
): Promise<ExplorerState> => {
  const { applicationId } = state
  const { excluded, items, pathSeparator, root } = state
  const droppedDirectoryPath = getFirstDroppedDirectoryPath(state, fileHandles, paths)
  if (droppedDirectoryPath) {
    return openDroppedDirectoryAsWorkspace(state, droppedDirectoryPath)
  }
  if (root === '') {
    return {
      ...state,
      dropTargets: [],
    }
  }
  await copyFilesElectron(root, fileHandles, paths, applicationId)
  const mergedDirents = await getMergedDirents(root, pathSeparator, items, excluded, applicationId)
  return {
    ...state,
    dropTargets: [],
    items: mergedDirents,
  }
}
