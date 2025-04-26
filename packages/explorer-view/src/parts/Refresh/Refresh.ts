import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as DirentType from '../DirentType/DirentType.ts'
import * as FileSystem from '../FileSystem/FileSystem.ts'
import { getExpandedDirents } from '../GetExpandedDirents/GetExpandedDirents.ts'
import * as GetExplorerMaxLineY from '../GetExplorerMaxLineY/GetExplorerMaxLineY.ts'
import * as GetFileIcons from '../GetFileIcons/GetFileIcons.ts'
import { getPaths } from '../GetPaths/GetPaths.ts'
import { refreshChildDirents } from '../RefreshChildDirents/RefreshChildDirents.ts'

// TODO add lots of tests for this
export const refresh = async (state: ExplorerState): Promise<ExplorerState> => {
  const { root, pathSeparator, minLineY, height, itemHeight, fileIconCache, items, focusedIndex } = state

  // Get all expanded folders
  const expandedDirents = getExpandedDirents(items)
  const expandedFolders = getPaths(expandedDirents)

  // Get top level dirents
  const topLevelDirents = await FileSystem.readDirWithFileTypes(root)
  const newDirents = topLevelDirents.map((dirent) => ({
    name: dirent.name,
    type: dirent.type === 'directory' ? DirentType.Directory : DirentType.File,
    path: root.endsWith(pathSeparator) ? `${root}${dirent.name}` : `${root}${pathSeparator}${dirent.name}`,
    depth: 0,
    selected: false,
  }))

  // Process expanded folders in parallel
  const expandedFolderResults = await Promise.all(
    expandedFolders.map(async (folderPath) => {
      const folderIndex = newDirents.findIndex((item) => item.path === folderPath)
      if (folderIndex !== -1) {
        const folder = newDirents[folderIndex]
        if (folder.type === DirentType.Directory) {
          const childItems = await refreshChildDirents(folder, pathSeparator, expandedFolders)
          // @ts-ignore
          folder.type = DirentType.DirectoryExpanded
          return { folderIndex, childItems }
        }
      }
      return null
    }),
  )

  // Insert child items in the correct order
  let offset = 0
  for (const result of expandedFolderResults) {
    if (result) {
      const { folderIndex, childItems } = result
      newDirents.splice(folderIndex + 1 + offset, 0, ...childItems)
      offset += childItems.length
    }
  }

  const maxLineY = GetExplorerMaxLineY.getExplorerMaxLineY(minLineY, height, itemHeight, newDirents.length)
  const visible = newDirents.slice(minLineY, maxLineY)
  const { icons, newFileIconCache } = await GetFileIcons.getFileIcons(visible, fileIconCache)
  let newFocusedIndex = focusedIndex
  if (focusedIndex >= newDirents.length) {
    newFocusedIndex = newDirents.length - 1
  }

  return {
    ...state,
    items: newDirents,
    fileIconCache: newFileIconCache,
    icons,
    maxLineY,
    focusedIndex: newFocusedIndex,
  }
}
