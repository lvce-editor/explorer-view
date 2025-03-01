import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as DirentType from '../DirentType/DirentType.ts'
import * as GetChildDirentsRecursively from '../GetChildDirentsRecursively/GetChildDirentsRecursively.ts'
import * as GetExplorerMaxLineY from '../GetExplorerMaxLineY/GetExplorerMaxLineY.ts'
import * as GetFileIcons from '../GetFileIcons/GetFileIcons.ts'
import * as GetParentEndIndex from '../GetParentEndIndex/GetParentEndIndex.ts'

export const expandRecursively = async (state: ExplorerState): Promise<ExplorerState> => {
  const { items, focusedIndex, pathSeparator, root, height, itemHeight, minLineY } = state
  const dirent =
    focusedIndex < 0
      ? {
          type: DirentType.Directory,
          path: root,
          depth: 0,
        }
      : items[focusedIndex]
  if (dirent.type !== DirentType.Directory && dirent.type !== DirentType.DirectoryExpanding && dirent.type !== DirentType.DirectoryExpanded) {
    return state
  }
  // TODO race condition: what if folder is being collapse while it is recursively expanding?
  // TODO race condition: what if folder is being deleted while it is recursively expanding?
  // TODO race condition: what if a new file/folder is created while the folder is recursively expanding?
  // @ts-ignore
  const childDirents = await GetChildDirentsRecursively.getChildDirentsRecursively(dirent, pathSeparator)
  const startIndex = focusedIndex
  if (focusedIndex >= 0) {
    const endIndex = GetParentEndIndex.getParentEndIndex(items, focusedIndex)
    const newDirents = [...items.slice(0, startIndex), ...childDirents, ...items.slice(endIndex)]
    const maxLineY = GetExplorerMaxLineY.getExplorerMaxLineY(minLineY, height, itemHeight, newDirents.length)
    const visible = newDirents.slice(minLineY, maxLineY)
    const { icons, newFileIconCache } = await GetFileIcons.getFileIcons(visible, state.fileIconCache)
    return {
      ...state,
      items: newDirents,
      maxLineY,
      icons,
      fileIconCache: newFileIconCache,
    }
  }
  const newDirents = childDirents.slice(1)
  const maxLineY = GetExplorerMaxLineY.getExplorerMaxLineY(minLineY, height, itemHeight, newDirents.length)
  const visible = newDirents.slice(minLineY, maxLineY)
  const { icons, newFileIconCache } = await GetFileIcons.getFileIcons(visible, state.fileIconCache)
  return {
    ...state,
    items: newDirents,
    maxLineY,
    icons,
    fileIconCache: newFileIconCache,
  }
}
