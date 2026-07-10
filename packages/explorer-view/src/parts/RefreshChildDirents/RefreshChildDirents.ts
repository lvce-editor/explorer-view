import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import * as DirentType from '../DirentType/DirentType.ts'
import * as FileSystem from '../FileSystem/FileSystem.ts'
import { isExcluded } from '../IsExcluded/IsExcluded.ts'

const refreshChildDirent = async (
  folder: ExplorerItem,
  dirent: any,
  pathSeparator: string,
  expandedFolders: readonly string[],
  excluded: readonly string[],
  root: string,
): Promise<readonly ExplorerItem[]> => {
  const path = folder.path.endsWith(pathSeparator) ? `${folder.path}${dirent.name}` : `${folder.path}${pathSeparator}${dirent.name}`
  const isExpandedFolder = expandedFolders.includes(path)
  let type = DirentType.File
  if (dirent.type === 'directory') {
    type = isExpandedFolder ? DirentType.DirectoryExpanded : DirentType.Directory
  }

  const item: ExplorerItem = {
    depth: folder.depth + 1,
    name: dirent.name,
    path,
    selected: false,
    type,
  }

  if (isExpandedFolder && dirent.type === 'directory') {
    const nestedItems = await refreshChildDirents(item, pathSeparator, expandedFolders, excluded, root)
    return [item, ...nestedItems]
  }

  return [item]
}

export const refreshChildDirents = async (
  folder: ExplorerItem,
  pathSeparator: string,
  expandedFolders: readonly string[],
  excluded: readonly string[] = [],
  root: string = folder.path,
): Promise<readonly ExplorerItem[]> => {
  const rawChildDirents = await FileSystem.readDirWithFileTypes(folder.path)
  const childDirents = rawChildDirents.filter((dirent) => {
    const path = folder.path.endsWith(pathSeparator) ? `${folder.path}${dirent.name}` : `${folder.path}${pathSeparator}${dirent.name}`
    return !isExcluded(root, path, excluded)
  })
  const childItems = await Promise.all(
    childDirents.map(async (dirent) => {
      return refreshChildDirent(folder, dirent, pathSeparator, expandedFolders, excluded, root)
    }),
  )
  return childItems.flat()
}
