import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import { copyFilesElectron } from '../CopyFilesElectron/CopyFilesElectron.ts'
import * as GetChildDirents from '../GetChildDirents/GetChildDirents.ts'

const mergeDirents = (oldDirents: readonly ExplorerItem[], newDirents: readonly ExplorerItem[]): any => {
  return newDirents
}

const getMergedDirents = async (root: any, pathSeparator: any, dirents: any): Promise<any> => {
  const childDirents = await GetChildDirents.getChildDirents(pathSeparator, root, 0)
  const mergedDirents = mergeDirents(dirents, childDirents)
  return mergedDirents
}

export const handleDrop = async (
  state: ExplorerState,
  fileHandles: readonly FileSystemHandle[],
  files: readonly File[],
  paths: readonly string[],
): Promise<ExplorerState> => {
  const { root, pathSeparator, items } = state
  await copyFilesElectron(root, fileHandles, files, paths)
  const mergedDirents = await getMergedDirents(root, pathSeparator, items)
  return {
    ...state,
    items: mergedDirents,
    dropTargets: [],
  }
}
