import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as GetWorkspaceUri from '../GetWorkspaceUri/GetWorkspaceUri.ts'
import * as LoadContent from '../LoadContent/LoadContent.ts'

export const handleWorkspaceChange = async (state: ExplorerState, _workspaceUri?: string, savedState?: unknown): Promise<ExplorerState> => {
  const { applicationId } = state
  const { root } = state
  const newRoot = await GetWorkspaceUri.getWorkspaceUri(applicationId)
  const state1 = newRoot === root ? state : { ...state, expandedPaths: [], root: newRoot }
  const newState = await LoadContent.loadContent(state1, savedState)
  return newState
}
