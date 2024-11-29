import * as DirentType from '../DirentType/DirentType.js'

const isExpandedDirectory = (dirent: any): boolean => {
  return dirent.type === DirentType.DirectoryExpanded
}

const getPath = (dirent: any): string => {
  return dirent.path
}

export const saveState = (state: any): any => {
  const { items, root, deltaY, minLineY, maxLineY } = state
  const expandedPaths = items.filter(isExpandedDirectory).map(getPath)
  return {
    expandedPaths,
    root,
    minLineY,
    maxLineY,
    deltaY,
  }
}
