import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as FileSystem from '../FileSystem/FileSystem.ts'
import * as GetExplorerMaxLineY from '../GetExplorerMaxLineY/GetExplorerMaxLineY.ts'
import * as GetFileIcons from '../GetFileIcons/GetFileIcons.ts'
import * as GetSettings from '../GetSettings/GetSettings.ts'
import * as GetVisibleExplorerItems from '../GetVisibleExplorerItems/GetVisibleExplorerItems.ts'
import * as GetWorkspacePath from '../GetWorkspacePath/GetWorkspacePath.ts'
import * as RestoreExpandedState from '../RestoreExpandedState/RestoreExpandedState.ts'

// TODO viewlet should only have create and refresh functions
// every thing else can be in a separate module <viewlet>.lazy.js
// and  <viewlet>.ipc.js

// viewlet: creating | refreshing | done | disposed
// TODO recycle viewlets (maybe)

// TODO instead of root string, there should be a root dirent

const getPathSeparator = (root: any): any => {
  return FileSystem.getPathSeparator(root)
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
  const {
    fileIconCache,
    cutItems,
    sourceControlIgnoredUris,
    dropTargets,
    editingErrorMessage,
    editingIcon,
    editingIndex,
    editingType,
    editingValue,
    focused,
    focusedIndex,
    items,
    width,
  } = state
  const { useChevrons, confirmDelete } = await GetSettings.getSettings()
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
  const visible = restoredDirents.slice(minLineY, maxLineY)
  const { icons, newFileIconCache } = await GetFileIcons.getFileIcons(visible, fileIconCache)

  const visibleExplorerItems = GetVisibleExplorerItems.getVisibleExplorerItems(
    items,
    minLineY,
    maxLineY,
    focusedIndex,
    editingIndex,
    editingType,
    editingValue,
    editingErrorMessage,
    icons,
    useChevrons,
    dropTargets,
    editingIcon,
    cutItems,
    sourceControlIgnoredUris,
  )
  return {
    ...state,
    confirmDelete,
    deltaY,
    excluded,
    fileIconCache: newFileIconCache,
    icons,
    items: restoredDirents,
    maxIndent: 10,
    maxLineY,
    minLineY,
    pathSeparator,
    root,
    useChevrons,
    visibleExplorerItems,
  }
}
