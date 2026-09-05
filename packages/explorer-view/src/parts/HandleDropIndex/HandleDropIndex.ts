import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as DirentType from '../DirentType/DirentType.ts'
import * as GetChildDirents from '../GetChildDirents/GetChildDirents.ts'
import * as GetParentStartIndex from '../GetParentStartIndex/GetParentStartIndex.ts'
import * as HandleDropRoot from '../HandleDropRoot/HandleDropRoot.ts'
import { handleInternalDrop } from '../HandleInternalDrop/HandleInternalDrop.ts'
import { uploadFileSystemHandles } from '../UploadFileSystemHandles/UploadFileSystemHandles.ts'

const getEndIndex = (items: readonly ExplorerItem[], index: number, dirent: ExplorerItem): number => {
  for (let i = index + 1; i < items.length; i++) {
    if (items[i].depth === dirent.depth) {
      return i
    }
  }
  return items.length
}

const getMergedDirents = (
  items: readonly ExplorerItem[],
  index: number,
  dirent: ExplorerItem,
  childDirents: readonly ExplorerItem[],
): readonly ExplorerItem[] => {
  const startIndex = index
  const endIndex = getEndIndex(items, index, dirent)
  const mergedDirents = [...items.slice(0, startIndex), { ...dirent, type: DirentType.DirectoryExpanded }, ...childDirents, ...items.slice(endIndex)]
  return mergedDirents
}

const handleDropIntoFolder = async (
  state: ExplorerState,
  dirent: ExplorerItem,
  index: number,
  fileHandles: readonly FileSystemHandle[],
): Promise<ExplorerState> => {
  const { applicationId } = state
  const { excluded, items, pathSeparator, root } = state

  await uploadFileSystemHandles(dirent.path, '/', fileHandles, applicationId)

  const childDirents = await GetChildDirents.getChildDirents(pathSeparator, dirent.path, dirent.depth, excluded, root, applicationId)
  const mergedDirents = getMergedDirents(items, index, dirent, childDirents)
  // TODO update maxlineY
  return {
    ...state,
    dropTargets: [],
    items: mergedDirents,
  }
}

const handleDropIntoFile = (
  state: ExplorerState,
  dirent: ExplorerItem,
  index: number,
  fileHandles: readonly FileSystemHandle[],
  paths: readonly string[],
): Promise<ExplorerState> => {
  const { items } = state
  const parentIndex = GetParentStartIndex.getParentStartIndex(items, index)
  if (parentIndex === -1) {
    return HandleDropRoot.handleDropRoot(state, fileHandles, paths)
  }
  return handleDropIndex(state, fileHandles, paths, parentIndex)
}

export const handleDropIndex = async (
  state: ExplorerState,
  fileHandles: readonly FileSystemHandle[],
  paths: readonly string[],
  index: number,
): Promise<ExplorerState> => {
  const { isReadonly, items } = state
  if (isReadonly) {
    return state
  }
  if (fileHandles.length === 0 && paths.length > 0) {
    return handleInternalDrop(state, paths, index)
  }
  const dirent = items[index]
  // TODO if it is a file, drop into the folder of the file
  // TODO if it is a folder, drop into the folder
  // TODO if it is a symlink, read symlink and determine if file can be dropped
  switch (dirent.type) {
    case DirentType.Directory:
    case DirentType.DirectoryExpanded:
      return handleDropIntoFolder(state, dirent, index, fileHandles)
    case DirentType.File:
      return handleDropIntoFile(state, dirent, index, fileHandles, paths)
    default:
      return state
  }
}
