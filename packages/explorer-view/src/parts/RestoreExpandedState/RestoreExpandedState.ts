import * as Character from '../Character/Character.ts'
import * as DirentType from '../DirentType/DirentType.ts'
import * as GetChildDirents from '../GetChildDirents/GetChildDirents.ts'
import * as IconTheme from '../IconTheme/IconTheme.ts'
import * as PromiseStatus from '../PromiseStatus/PromiseStatus.ts'
import * as SortExplorerItems from '../SortExplorerItems/SortExplorerItems.ts'

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

const createDirents = (root: any, expandedDirentPaths: any, expandedDirentChildren: any, excluded: any, pathSeparator: any): any => {
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

const getSavedExpandedPaths = (savedState: any, root: any): any => {
  if (savedState && savedState.root !== root) {
    return []
  }
  if (savedState && savedState.expandedPaths && Array.isArray(savedState.expandedPaths)) {
    return savedState.expandedPaths
  }
  return []
}

export const restoreExpandedState = async (savedState: any, root: any, pathSeparator: any, excluded: any): Promise<any> => {
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
  const expandedDirentChildren = await Promise.allSettled(expandedDirentPaths.map(GetChildDirents.getChildDirentsRaw))
  if (expandedDirentChildren[0].status === PromiseStatus.Rejected) {
    throw expandedDirentChildren[0].reason
  }
  const dirents = createDirents(root, expandedDirentPaths, expandedDirentChildren, excluded, pathSeparator)
  return dirents
}
