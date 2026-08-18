import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as FileSystem from '../FileSystem/FileSystem.ts'
import * as GetErrorCode from '../GetErrorCode/GetErrorCode.ts'
import * as GetErrorMessage from '../GetErrorMessage/GetErrorMessage.ts'
import * as GetFileDecorations from '../GetFileDecorations/GetFileDecorations.ts'
import * as GetFriendlyErrorMessage from '../GetFriendlyErrorMessage/GetFriendlyErrorMessage.ts'
import * as GetGitIgnoredUris from '../GetGitIgnoredUris/GetGitIgnoredUris.ts'
import * as GetPathSeparator from '../GetPathSeparator/GetPathSeparator.ts'
import * as GetRestoredDeltaY from '../GetRestoredDeltaY/GetRestoredDeltaY.ts'
import * as GetSavedRoot from '../GetSavedRoot/GetSavedRoot.ts'
import { getScheme } from '../GetScheme/GetScheme.ts'
import * as GetSettings from '../GetSettings/GetSettings.ts'
import * as GetWorkspacePath from '../GetWorkspacePath/GetWorkspacePath.ts'
import * as RestoreExpandedState from '../RestoreExpandedState/RestoreExpandedState.ts'

const getExpandedPaths = (
  savedState: unknown,
  root: string,
  currentRoot: string,
  currentExpandedPaths: readonly string[],
  preserveExpandState: boolean,
): readonly string[] => {
  if (!preserveExpandState) {
    return []
  }
  if (savedState !== undefined && savedState !== null) {
    return RestoreExpandedState.getSavedExpandedPaths(savedState, root)
  }
  if (currentRoot === root) {
    return currentExpandedPaths
  }
  return []
}

export const loadContent = async (state: ExplorerState, savedState: any): Promise<ExplorerState> => {
  const { assetDir, expandedPaths: currentExpandedPaths, height, itemHeight, platform, root: currentRoot } = state
  const { confirmDelete, excluded, gitIgnoreDecorations, preserveExpandState, sourceControlDecorations, useChevrons } =
    await GetSettings.getSettings()
  const workspacePath = await GetWorkspacePath.getWorkspacePath()
  const root = GetSavedRoot.getSavedRoot(savedState, workspacePath)
  const expandedPaths = getExpandedPaths(savedState, root, currentRoot, currentExpandedPaths, preserveExpandState)
  try {
    // TODO path separator could be restored from saved state
    const [pathSeparator, isReadonly] = await Promise.all([
      GetPathSeparator.getPathSeparator(root), // TODO only load path separator once
      root === '' ? false : FileSystem.isReadonly(root),
    ])
    const restoredDirents = await RestoreExpandedState.restoreExpandedState(expandedPaths, root, pathSeparator, excluded)
    const rawDeltaY = GetRestoredDeltaY.getRestoredDeltaY(savedState)
    const maxDeltaY = Math.max(restoredDirents.length * itemHeight - height, 0)
    const deltaY = Math.min(Math.max(rawDeltaY, 0), maxDeltaY)
    const minLineY = Math.round(deltaY / itemHeight)

    const scheme = getScheme(root)
    const decorations = await GetFileDecorations.getFileDecorations(
      scheme,
      root,
      restoredDirents.filter((item: any) => item.depth === 1).map((item: any) => item.path),
      sourceControlDecorations,
      assetDir,
      platform,
    )
    const sourceControlIgnoredUris = await GetGitIgnoredUris.getGitIgnoredUris(root, restoredDirents, pathSeparator, gitIgnoreDecorations)
    return {
      ...state,
      confirmDelete,
      decorations,
      deltaY,
      errorCode: '',
      errorMessage: '',
      excluded,
      expandedPaths,
      gitIgnoreDecorations,
      hasError: false,
      initial: false,
      isReadonly,
      items: restoredDirents,
      maxIndent: 10,
      minLineY,
      pathSeparator,
      preserveExpandState,
      root,
      sourceControlIgnoredUris,
      useChevrons,
    }
  } catch (error) {
    const errorCode = GetErrorCode.getErrorCode(error)
    const errorMessage = GetFriendlyErrorMessage.getFriendlyErrorMessage(GetErrorMessage.getErrorMessage(error), errorCode)
    return {
      ...state,
      confirmDelete,
      errorCode,
      errorMessage,
      expandedPaths,
      gitIgnoreDecorations,
      hasError: true,
      initial: false,
      isReadonly: false,
      items: [],
      preserveExpandState,
      root,
      useChevrons,
    }
  }
}
