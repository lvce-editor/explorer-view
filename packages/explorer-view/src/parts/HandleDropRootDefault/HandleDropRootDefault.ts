import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import { getChildDirents } from '../GetChildDirents/GetChildDirents.ts'
import * as Refresh from '../Refresh/Refresh.ts'
import * as UploadFileSystemHandles from '../UploadFileSystemHandles/UploadFileSystemHandles.ts'

const mergeDirents = (oldDirents: readonly any[], newDirents: readonly any[]): readonly any[] => {
  return newDirents
}

const getMergedDirents = async (root: string, pathSeparator: string, dirents: readonly any[]): Promise<readonly any[]> => {
  const childDirents = await getChildDirents(pathSeparator, root, 0)
  const mergedDirents = mergeDirents(dirents, childDirents)
  return mergedDirents
}

export const handleDrop = async (state: ExplorerState, fileHandles: readonly FileSystemHandle[], files: readonly File[]): Promise<ExplorerState> => {
  const { items, pathSeparator, root } = state
  const handled = await UploadFileSystemHandles.uploadFileSystemHandles(root, pathSeparator, fileHandles)
  if (handled) {
    const updated = await Refresh.refresh(state)
    return {
      ...updated,
      dropTargets: [],
    }
  }
  const mergedDirents = await getMergedDirents(root, pathSeparator, items)
  return {
    ...state,
    dropTargets: [],
    items: mergedDirents,
  }
}
