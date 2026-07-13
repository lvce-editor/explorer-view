import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as GetWorkspacePath from '../GetWorkspacePath/GetWorkspacePath.ts'
import * as LoadContent from '../LoadContent/LoadContent.ts'

export const handleWorkspaceChange = async (state: ExplorerState, _workspacePath?: string, savedState?: unknown): Promise<ExplorerState> => {
  const newRoot = await GetWorkspacePath.getWorkspacePath()
  const state1 = { ...state, root: newRoot }
  const newState = await LoadContent.loadContent(state1, savedState)
  return newState
}
