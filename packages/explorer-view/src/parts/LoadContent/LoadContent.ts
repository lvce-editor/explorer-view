import type { ExplorerState } from '../EXplorerState/ExplorerState.ts'
import * as DirentType from '../DirentType/DirentType.ts'
import * as FileSystem from '../FileSystem/FileSystem.ts'
import * as GetExplorerMaxLineY from '../GetExplorerMaxLineY/GetExplorerMaxLineY.ts'
import * as GetFileIcons from '../GetFileIcons/GetFileIcons.ts'
import * as GetSettings from '../GetSettings/GetSettings.ts'
import * as GetWorkspacePath from '../GetWorkspacePath/GetWorkspacePath.ts'
import * as IconTheme from '../IconTheme/IconTheme.ts'
import * as RestoreExpandedState from '../RestoreExpandedState/RestoreExpandedState.ts'
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

const getExcluded = (): any => {
  const excludedObject = {}
  const excluded = []
  for (const [key, value] of Object.entries(excludedObject)) {
    if (value) {
      excluded.push(key)
    }
  }
  return excluded
}

const getSavedRoot = (savedState: any, workspacePath: any): any => {
  return workspacePath
}

export const loadContent = async (state: ExplorerState, savedState: any): Promise<ExplorerState> => {
  const { useChevrons } = await GetSettings.getSettings()
  const workspacePath = await GetWorkspacePath.getWorkspacePath()
  const root = getSavedRoot(savedState, workspacePath)
  // TODO path separator could be restored from saved state
  const pathSeparator = await getPathSeparator(root) // TODO only load path separator once
  const excluded = getExcluded()
  const restoredDirents = await RestoreExpandedState.restoreExpandedState(savedState, root, pathSeparator, excluded)
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
  const { icons, newFileIconCache } = await GetFileIcons.getFileIcons(restoredDirents, Object.create(null))
  return {
    ...state,
    root,
    items: restoredDirents,
    icons,
    fileIconCache: newFileIconCache,
    minLineY,
    deltaY,
    maxLineY,
    pathSeparator,
    excluded,
    useChevrons,
  }
}
