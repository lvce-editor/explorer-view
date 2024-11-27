import * as Character from '../Character/Character.ts'
import * as DirentType from '../DirentType/DirentType.ts'
import * as FileSystem from '../FileSystem/FileSystem.ts'
import { getChildDirentsRaw } from '../GetChildDirents/GetChildDirents.ts'
import * as GetExplorerMaxLineY from '../GetExplorerMaxLineY/GetExplorerMaxLineY.ts'
import * as IconTheme from '../IconTheme/IconTheme.ts'
import * as PromiseStatus from '../PromiseStatus/PromiseStatus.ts'
import * as SortExplorerItems from '../SortExplorerItems/SortExplorerItems.ts'
// TODO viewlet should only have create and refresh functions
// every thing else can be in a separate module <viewlet>.lazy.js
// and  <viewlet>.ipc.js

// viewlet: creating | refreshing | done | disposed
// TODO recycle viewlets (maybe)

// TODO instead of root string, there should be a root dirent

const getPathSeparator = (root: any): any => {
  return FileSystem.getPathSeparator(root)
}

// @ts-ignore
const isExpandedDirectory = (dirent: any): boolean => {
  return dirent.type === DirentType.DirectoryExpanded
}

// @ts-ignore
const getPath = (dirent): any => {
  return dirent.path
}

const getSavedChildDirents = (map: any, path: any, depth: any, excluded: any, pathSeparator: any): any => {
  const children = map[path]
  if (!children) {
    return []
  }
  const dirents = []
  SortExplorerItems.sortExplorerItems(children)
  const visible = []
  const displayRoot = path.endsWith(pathSeparator) ? path : path + pathSeparator
  for (const child of children) {
    if (excluded.includes(child.name)) {
      continue
    }
    visible.push(child)
  }
  const visibleLength = visible.length
  for (let i = 0; i < visibleLength; i++) {
    const child = visible[i]
    const { name, type } = child
    const childPath = displayRoot + name
    if ((child.type === DirentType.Directory || child.type === DirentType.SymLinkFolder) && childPath in map) {
      dirents.push({
        depth,
        posInSet: i + 1,
        setSize: visibleLength,
        icon: IconTheme.getFolderIcon({ name }),
        name,
        path: childPath,
        type: DirentType.DirectoryExpanded,
      })
      dirents.push(...getSavedChildDirents(map, childPath, depth + 1, excluded, pathSeparator))
    } else {
      dirents.push({
        depth,
        posInSet: i + 1,
        setSize: visibleLength,
        icon: IconTheme.getIcon({ type, name }),
        name,
        path: childPath,
        type,
      })
    }
  }
  return dirents
}

const createDirents = (root: any, expandedDirentPaths: any, expandedDirentChildren: any, excluded: any, pathSeparator: any) => {
  const dirents = []
  const map = Object.create(null)
  for (let i = 0; i < expandedDirentPaths.length; i++) {
    const path = expandedDirentPaths[i]
    const children = expandedDirentChildren[i]
    if (children.status === PromiseStatus.Fulfilled) {
      map[path] = children.value
    }
  }
  dirents.push(...getSavedChildDirents(map, root, 1, excluded, pathSeparator))
  return dirents
}

const getSavedExpandedPaths = (savedState: any, root: any) => {
  if (savedState && savedState.root !== root) {
    return []
  }
  if (savedState && savedState.expandedPaths && Array.isArray(savedState.expandedPaths)) {
    return savedState.expandedPaths
  }
  return []
}

const restoreExpandedState = async (savedState: any, root: any, pathSeparator: any, excluded: any): Promise<any> => {
  // TODO read all opened folders in parallel
  // ignore ENOENT errors
  // ignore ENOTDIR errors
  // merge all dirents
  // restore scroll location
  const expandedPaths = getSavedExpandedPaths(savedState, root)
  if (root === Character.EmptyString) {
    return []
  }
  const expandedDirentPaths = [root, ...expandedPaths]
  const expandedDirentChildren = await Promise.allSettled(expandedDirentPaths.map(getChildDirentsRaw))
  if (expandedDirentChildren[0].status === PromiseStatus.Rejected) {
    throw expandedDirentChildren[0].reason
  }
  const dirents = createDirents(root, expandedDirentPaths, expandedDirentChildren, excluded, pathSeparator)
  return dirents
}

const getExcluded = () => {
  const excludedObject = {}
  const excluded = []
  for (const [key, value] of Object.entries(excludedObject)) {
    if (value) {
      excluded.push(key)
    }
  }
  return excluded
}

const getSavedRoot = (savedState: any, workspacePath: any) => {
  return workspacePath
}

export const loadContent = async (state: any, savedState: any) => {
  const root = getSavedRoot(savedState, '')
  // TODO path separator could be restored from saved state
  const pathSeparator = await getPathSeparator(root) // TODO only load path separator once
  const excluded = getExcluded()
  const restoredDirents = await restoreExpandedState(savedState, root, pathSeparator, excluded)
  const { itemHeight, height } = state
  let minLineY = 0
  if (savedState && typeof savedState.minLineY === 'number') {
    minLineY = savedState.minLineY
  }
  let deltaY = 0
  if (savedState && typeof savedState.deltaY === 'number') {
    deltaY = savedState.deltaY
  }
  const maxLineY = GetExplorerMaxLineY.getExplorerMaxLineY(minLineY, height, itemHeight, restoredDirents.length)
  return {
    ...state,
    root,
    items: restoredDirents,
    minLineY,
    deltaY,
    maxLineY,
    pathSeparator,
    excluded,
  }
}
