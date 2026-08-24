import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'

const getMissingFolderMessage = (root: string): string => {
  if (root) {
    return `Could not open "${root}" because the folder does not exist. It may have been moved or deleted.`
  }
  return 'Could not open folder because the folder does not exist. It may have been moved or deleted.'
}

export const getLoadErrorMessage = (state: ExplorerState): string => {
  const { errorCode, errorMessage, hasError, root } = state
  if (hasError) {
    if (errorCode === 'ENOENT') {
      return getMissingFolderMessage(root)
    }
    const code = errorCode ? ` (error code: ${errorCode})` : ''
    const reason = errorMessage || 'an unexpected error occurred'
    return `Could not open folder due to ${reason}${code}.`
  }
  return ''
}

export const shouldShowOpenAnotherFolderButton = (state: ExplorerState): boolean => {
  const { errorCode, hasError } = state
  return hasError && errorCode === 'ENOENT'
}
