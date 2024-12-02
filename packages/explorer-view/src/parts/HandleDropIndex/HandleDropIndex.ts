import * as DirentType from '../DirentType/DirentType.ts'
import * as FileSystem from '../FileSystem/FileSystem.ts'
import * as GetChildDirents from '../GetChildDirents/GetChildDirents.ts'
import * as GetParentStartIndex from '../GetParentStartIndex/GetParentStartIndex.ts'
import * as HandleDropRoot from '../HandleDropRoot/HandleDropRoot.ts'

const getEndIndex = (items: any[], index: number, dirent: any): number => {
  for (let i = index + 1; i < items.length; i++) {
    if (items[i].depth === dirent.depth) {
      return i
    }
  }
  return items.length
}

const getMergedDirents = (items: any, index: number, dirent: any, childDirents: any): any => {
  const startIndex = index
  const endIndex = getEndIndex(items, index, dirent)
  const mergedDirents = [...items.slice(0, startIndex), { ...dirent, type: DirentType.DirectoryExpanded }, ...childDirents, ...items.slice(endIndex)]
  return mergedDirents
}

const handleDropIntoFolder = async (state: any, dirent: any, index: number, files: any): Promise<any> => {
  const { pathSeparator, items } = state
  for (const file of files) {
    // TODO path basename
    const baseName = file
    const to = dirent.path + pathSeparator + baseName
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

const handleDropIntoFile = (state: any, dirent: any, index: number, files: any): any => {
  const { items } = state
  const parentIndex = GetParentStartIndex.getParentStartIndex(items, index)
  if (parentIndex === -1) {
    return HandleDropRoot.handleDropRoot(state, files)
  }
  // @ts-ignore
  return handleDropIndex(parentIndex)
}

export const handleDropIndex = (state: any, index: number, files: any): Promise<any> => {
  const { items } = state
  const dirent = items[index]
  // TODO if it is a file, drop into the folder of the file
  // TODO if it is a folder, drop into the folder
  // TODO if it is a symlink, read symlink and determine if file can be dropped
  switch (dirent.type) {
    case DirentType.Directory:
    case DirentType.DirectoryExpanded:
      return handleDropIntoFolder(state, dirent, index, files)
    case DirentType.File:
      return handleDropIntoFile(state, dirent, index, files)
    default:
      return state
  }
}
