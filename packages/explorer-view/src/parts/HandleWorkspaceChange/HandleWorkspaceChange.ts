import * as GetWorkspacePath from '../GetWorkspacePath/GetWorkspacePath.ts'
import * as LoadContent from '../LoadContent/LoadContent.ts'

export const handleWorkspaceChange = async (state: any): Promise<any> => {
  const newRoot = await GetWorkspacePath.getWorkspacePath()
  const state1 = { ...state, root: newRoot }
  const newState = await LoadContent.loadContent(state1, undefined)
  return newState
}
