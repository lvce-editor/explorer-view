import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as DirentType from '../DirentType/DirentType.ts'
import * as FileSystem from '../FileSystem/FileSystem.ts'
import * as GetExplorerMaxLineY from '../GetExplorerMaxLineY/GetExplorerMaxLineY.ts'
import * as GetFileIcons from '../GetFileIcons/GetFileIcons.ts'

// TODO add lots of tests for this
export const refresh = async (state: ExplorerState): Promise<ExplorerState> => {
  const { root, pathSeparator, minLineY, height, itemHeight, fileIconCache } = state

  // Get all expanded folders
  const expandedFolders = state.items
    .filter((item) => item.type === DirentType.DirectoryExpanded || item.type === DirentType.DirectoryExpanding)
    .map((item) => item.path)

  // Get top level dirents
  const topLevelDirents = await FileSystem.readDirWithFileTypes(root)
  const newDirents = topLevelDirents.map((dirent) => ({
    name: dirent.name,
    type: dirent.type === 'directory' ? DirentType.Directory : DirentType.File,
    path: root.endsWith(pathSeparator) ? `${root}${dirent.name}` : `${root}${pathSeparator}${dirent.name}`,
    depth: 0,
    selected: false,
  }))

  // Restore expanded state for folders that still exist
  for (const folderPath of expandedFolders) {
    const folderIndex = newDirents.findIndex((item) => item.path === folderPath)
    if (folderIndex !== -1) {
      const folder = newDirents[folderIndex]
      if (folder.type === DirentType.Directory) {
        const childDirents = await FileSystem.readDirWithFileTypes(folderPath)
        const childItems = childDirents.map((dirent) => ({
          name: dirent.name,
          type: dirent.type === 'directory' ? DirentType.Directory : DirentType.File,
          path: folderPath.endsWith(pathSeparator) ? `${folderPath}${dirent.name}` : `${folderPath}${pathSeparator}${dirent.name}`,
          depth: folder.depth + 1,
          selected: false,
        }))
        newDirents.splice(folderIndex + 1, 0, ...childItems)
        // @ts-ignore
        folder.type = DirentType.DirectoryExpanded
      }
    }
  }

  const maxLineY = GetExplorerMaxLineY.getExplorerMaxLineY(minLineY, height, itemHeight, newDirents.length)
  const visible = newDirents.slice(minLineY, maxLineY)
  const { icons, newFileIconCache } = await GetFileIcons.getFileIcons(visible, fileIconCache)

  return {
    ...state,
    items: newDirents,
    fileIconCache: newFileIconCache,
    icons,
    maxLineY,
  }
}
