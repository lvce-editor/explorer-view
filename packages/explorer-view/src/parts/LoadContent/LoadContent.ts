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

export const loadContent = async (state: ExplorerState, savedState: any): Promise<ExplorerState> => {
  const { assetDir, height, itemHeight, platform } = state
  const { confirmDelete, excluded, gitIgnoreDecorations, sourceControlDecorations, useChevrons } = await GetSettings.getSettings()
  const workspacePath = await GetWorkspacePath.getWorkspacePath()
  const root = GetSavedRoot.getSavedRoot(savedState, workspacePath)
  try {
    // TODO path separator could be restored from saved state
    const [pathSeparator, isReadonly] = await Promise.all([
      GetPathSeparator.getPathSeparator(root), // TODO only load path separator once
      FileSystem.isReadonly(root),
    ])
    const restoredDirents = await RestoreExpandedState.restoreExpandedState(savedState, root, pathSeparator, excluded)
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
      gitIgnoreDecorations,
      hasError: false,
      initial: false,
      isReadonly,
      items: restoredDirents,
      maxIndent: 10,
      minLineY,
      pathSeparator,
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
      gitIgnoreDecorations,
      hasError: true,
      initial: false,
      isReadonly: false,
      items: [],
      root,
      useChevrons,
    }
  }
}
