import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as FileSystem from '../FileSystem/FileSystem.ts'
import * as GetFileDecorations from '../GetFileDecorations/GetFileDecorations.ts'
import { getScheme } from '../GetScheme/GetScheme.ts'
import * as GetSettings from '../GetSettings/GetSettings.ts'
import * as GetWorkspacePath from '../GetWorkspacePath/GetWorkspacePath.ts'
import * as RestoreExpandedState from '../RestoreExpandedState/RestoreExpandedState.ts'

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
  const { assetDir, platform } = state
  const { confirmDelete, sourceControlDecorations, useChevrons } = await GetSettings.getSettings()
  const workspacePath = await GetWorkspacePath.getWorkspacePath()
  const root = getSavedRoot(savedState, workspacePath)
  // TODO path separator could be restored from saved state
  const pathSeparator = await getPathSeparator(root) // TODO only load path separator once
  const excluded = getExcluded()
  const restoredDirents = await RestoreExpandedState.restoreExpandedState(savedState, root, pathSeparator, excluded)
  let minLineY = 0
  if (savedState && typeof savedState.minLineY === 'number') {
    minLineY = savedState.minLineY
  }
  let deltaY = 0
  if (savedState && typeof savedState.deltaY === 'number') {
    deltaY = savedState.deltaY
  }

  const scheme = getScheme(root)
  const decorations = await GetFileDecorations.getFileDecorations(
    scheme,
    root,
    restoredDirents.filter((item: any) => item.depth === 1).map((item: any) => item.path),
    sourceControlDecorations,
    assetDir,
    platform,
  )
  return {
    ...state,
    confirmDelete,
    decorations,
    deltaY,
    excluded,
    initial: true,
    items: restoredDirents,
    maxIndent: 10,
    minLineY,
    pathSeparator,
    root,
    useChevrons,
  }
}
