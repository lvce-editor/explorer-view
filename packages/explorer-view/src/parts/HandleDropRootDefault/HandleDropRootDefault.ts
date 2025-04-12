import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import { getChildDirents } from '../GetChildDirents/GetChildDirents.ts'
import * as UploadFileSystemHandles from '../UploadFileSystemHandles/UploadFileSystemHandles.ts'

const mergeDirents = (oldDirents: readonly any[], newDirents: readonly any[]): readonly any[] => {
  return newDirents
}

const getMergedDirents = async (root: string, pathSeparator: string, dirents: readonly any[]): Promise<readonly any[]> => {
  const childDirents = await getChildDirents(pathSeparator, {
    path: root,
    depth: 0,
  })
  const mergedDirents = mergeDirents(dirents, childDirents)
  return mergedDirents
}

export const handleDrop = async (state: ExplorerState, files: readonly any[]): Promise<ExplorerState> => {
  const { root, pathSeparator, items } = state
  const handled = await UploadFileSystemHandles.uploadFileSystemHandles(root, pathSeparator, files)
  if (handled) {
    return state
  }
  const mergedDirents = await getMergedDirents(root, pathSeparator, items)
  return {
    ...state,
    items: mergedDirents,
    dropTargets: [],
  }
}
