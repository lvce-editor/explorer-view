import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as DirentType from '../DirentType/DirentType.ts'
import * as FileSystem from '../FileSystem/FileSystem.ts'
import * as GetChildDirents from '../GetChildDirents/GetChildDirents.ts'
import * as GetParentStartIndex from '../GetParentStartIndex/GetParentStartIndex.ts'
import * as HandleDropRoot from '../HandleDropRoot/HandleDropRoot.ts'

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
  files: readonly File[],
): Promise<ExplorerState> => {
  const { pathSeparator, items } = state
  // @ts-ignore
  for (const file of fileHandles) {
    // TODO path basename
    const baseName = file.name
    const to = dirent.path + pathSeparator + baseName
    // @ts-ignore
    await FileSystem.copy(file, to)
  }
  const childDirents = await GetChildDirents.getChildDirents(pathSeparator, dirent)
  const mergedDirents = getMergedDirents(items, index, dirent, childDirents)
  // TODO update maxlineY
  return {
    ...state,
    items: mergedDirents,
    dropTargets: [],
  }
}

const handleDropIntoFile = (
  state: ExplorerState,
  dirent: ExplorerItem,
  index: number,
  fileHandles: readonly FileSystemHandle[],
  files: readonly File[],
): Promise<ExplorerState> => {
  const { items } = state
  const parentIndex = GetParentStartIndex.getParentStartIndex(items, index)
  if (parentIndex === -1) {
    return HandleDropRoot.handleDropRoot(state, fileHandles, files)
  }
  // @ts-ignore
  return handleDropIndex(parentIndex)
}

export const handleDropIndex = async (
  state: ExplorerState,
  fileHandles: readonly FileSystemHandle[],
  files: readonly File[],
  index: number,
): Promise<ExplorerState> => {
  const { items } = state
  const dirent = items[index]
  // TODO if it is a file, drop into the folder of the file
  // TODO if it is a folder, drop into the folder
  // TODO if it is a symlink, read symlink and determine if file can be dropped
  switch (dirent.type) {
    case DirentType.Directory:
    case DirentType.DirectoryExpanded:
      return handleDropIntoFolder(state, dirent, index, fileHandles, files)
    case DirentType.File:
      return handleDropIntoFile(state, dirent, index, fileHandles, files)
    default:
      return state
  }
}
