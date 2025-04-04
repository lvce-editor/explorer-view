import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import { getChildDirents } from '../GetChildDirents/GetChildDirents.ts'
import * as UploadFileSystemHandles from '../UploadFileSystemHandles/UploadFileSystemHandles.ts'

const mergeDirents = (oldDirents: any, newDirents: any): any => {
  return newDirents
}

const getMergedDirents = async (root: any, pathSeparator: any, dirents: any): Promise<any> => {
  const childDirents = await getChildDirents(pathSeparator, {
    path: root,
    depth: 0,
  })
  const mergedDirents = mergeDirents(dirents, childDirents)
  return mergedDirents
}

export const handleDrop = async (state: ExplorerState, files: any): Promise<ExplorerState> => {
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
