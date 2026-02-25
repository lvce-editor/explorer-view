import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'

export const getLoadErrorMessage = (state: ExplorerState): string => {
  if (state.hasError) {
    const code = state.errorCode ? ` (error code: ${state.errorCode})` : ''
    const reason = state.errorMessage || 'an unexpected error occurred'
    return `Could not open folder due to ${reason}${code}.`
  }
  return ''
}
