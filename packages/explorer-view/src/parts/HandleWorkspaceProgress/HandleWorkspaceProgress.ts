import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'

export const handleWorkspaceProgress = (state: ExplorerState, message = ''): ExplorerState => {
  const { workspaceProgressMessage } = state
  if (workspaceProgressMessage === message) {
    return state
  }
  return {
    ...state,
    workspaceProgressMessage: message,
  }
}
