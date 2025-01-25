import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as DirentType from '../DirentType/DirentType.ts'
import * as GetChildDirents from '../GetChildDirents/GetChildDirents.ts'
import * as GetExplorerMaxLineY from '../GetExplorerMaxLineY/GetExplorerMaxLineY.ts'
import * as GetParentEndIndex from '../GetParentEndIndex/GetParentEndIndex.ts'
import * as MakeExpanded from '../MakeExpanded/MakeExpanded.ts'

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
  // TODO this is very inefficient
  const getChildDirentsRecursively = async (dirent: ExplorerItem): Promise<readonly ExplorerItem[]> => {
    switch (dirent.type) {
      case DirentType.File:
        return [dirent]
      case DirentType.Directory:
      case DirentType.DirectoryExpanding:
      case DirentType.DirectoryExpanded:
        const childDirents = await GetChildDirents.getChildDirents(pathSeparator, dirent)
        const all = [MakeExpanded.makeExpanded(dirent)]
        for (const childDirent of childDirents) {
          const childAll = await getChildDirentsRecursively(childDirent)
          all.push(...childAll)
        }
        return all
      default:
        return []
    }
  }
  // TODO race condition: what if folder is being collapse while it is recursively expanding?
  // TODO race condition: what if folder is being deleted while it is recursively expanding?
  // TODO race condition: what if a new file/folder is created while the folder is recursively expanding?
  // @ts-ignore
  const childDirents = await getChildDirentsRecursively(dirent)
  const startIndex = focusedIndex
  if (focusedIndex >= 0) {
    const endIndex = GetParentEndIndex.getParentEndIndex(items, focusedIndex)
    const newDirents = [...items.slice(0, startIndex), ...childDirents, ...items.slice(endIndex)]
    const maxLineY = GetExplorerMaxLineY.getExplorerMaxLineY(minLineY, height, itemHeight, newDirents.length)
    return {
      ...state,
      items: newDirents,
      maxLineY,
    }
  }
  const newDirents = childDirents.slice(1)
  const maxLineY = GetExplorerMaxLineY.getExplorerMaxLineY(minLineY, height, itemHeight, newDirents.length)
  return {
    ...state,
    items: newDirents,
    maxLineY,
  }
}
