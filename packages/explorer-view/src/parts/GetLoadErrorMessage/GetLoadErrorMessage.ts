import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'

const RE_SENTENCE_END = /[.!?]$/

const getMissingFolderMessage = (root: string): string => {
  if (root) {
    return `Could not open "${root}" because the folder does not exist. It may have been moved or deleted.`
  }
  return 'Could not open folder because the folder does not exist. It may have been moved or deleted.'
}

const toSentence = (message: string): string => {
  const normalized = `${message[0].toUpperCase()}${message.slice(1)}`
  return RE_SENTENCE_END.test(normalized) ? normalized : `${normalized}.`
}

export const getLoadErrorMessage = (state: ExplorerState): string => {
  const { errorCode, errorMessage, hasError, root } = state
  if (hasError) {
    if (errorCode === 'ENOENT') {
      return getMissingFolderMessage(root)
    }
    const reason = errorMessage || 'an unexpected error occurred'
    const code = errorCode ? ` Error code: ${errorCode}.` : ''
    return `Could not open folder. ${toSentence(reason)}${code}`
  }
  return ''
}

export const shouldShowOpenAnotherFolderButton = (state: ExplorerState): boolean => {
  const { errorCode, hasError } = state
  return hasError && errorCode === 'ENOENT'
}
