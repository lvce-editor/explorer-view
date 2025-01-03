import * as DirentType from '../DirentType/DirentType.ts'
import * as GetChildDirents from '../GetChildDirents/GetChildDirents.ts'
import * as GetExplorerMaxLineY from '../GetExplorerMaxLineY/GetExplorerMaxLineY.ts'

export const expandAll = async (state: any): Promise<any> => {
  const { items, focusedIndex, pathSeparator, minLineY, height, itemHeight } = state
  if (focusedIndex === -1) {
    return state
  }
  const dirent = items[focusedIndex]
  const depth = dirent.depth
  const newDirents = [...items]
  // TODO fetch child dirents in parallel
  for (const dirent of newDirents) {
    if (dirent.depth === depth && dirent.type === DirentType.Directory) {
      // TODO expand
      // TODO avoid mutating state here
      dirent.type = DirentType.DirectoryExpanding
      // TODO handle error
      // TODO race condition
      const childDirents = await GetChildDirents.getChildDirents(pathSeparator, dirent)
      const newIndex = newDirents.indexOf(dirent)
      if (newIndex === -1) {
        continue
      }
      newDirents.splice(newIndex + 1, 0, ...childDirents)
      // TODO avoid mutating state here
      dirent.type = DirentType.DirectoryExpanded
      // await expand(state, dirent.index)
    }
  }
  const maxLineY = GetExplorerMaxLineY.getExplorerMaxLineY(minLineY, height, itemHeight, newDirents.length)
  return {
    ...state,
    items: newDirents,
    maxLineY,
  }
}
