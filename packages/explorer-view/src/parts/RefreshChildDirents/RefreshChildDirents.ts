import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import * as DirentType from '../DirentType/DirentType.ts'
import * as FileSystem from '../FileSystem/FileSystem.ts'

export const refreshChildDirents = async (
  folder: ExplorerItem,
  pathSeparator: string,
  expandedFolders: readonly string[],
): Promise<readonly ExplorerItem[]> => {
  const childDirents = await FileSystem.readDirWithFileTypes(folder.path)
  const childItems = await Promise.all(
    childDirents.map(async (dirent) => {
      const path = folder.path.endsWith(pathSeparator) ? `${folder.path}${dirent.name}` : `${folder.path}${pathSeparator}${dirent.name}`
      const isExpandedFolder = expandedFolders.includes(path)
      const type = dirent.type === 'directory' ? (isExpandedFolder ? DirentType.DirectoryExpanded : DirentType.Directory) : DirentType.File

      const item: ExplorerItem = {
        name: dirent.name,
        type,
        path,
        depth: folder.depth + 1,
        selected: false,
      }

      if (isExpandedFolder) {
        const nestedItems = await refreshChildDirents(item, pathSeparator, expandedFolders)
        return [item, ...nestedItems]
      }

      return [item]
    }),
  )
  return childItems.flat()
}
