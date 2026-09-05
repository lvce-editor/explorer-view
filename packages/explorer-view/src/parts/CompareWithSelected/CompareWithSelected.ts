import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as GetFocusedFile from '../GetFocusedFile/GetFocusedFile.ts'
import * as OpenDiff from '../OpenDiff/OpenDiff.ts'

export const compareWithSelected = async (state: ExplorerState): Promise<ExplorerState> => {
  const { applicationId } = state
  const { compareSourceUri } = state
  const focusedFile = GetFocusedFile.getFocusedFile(state)
  if (!focusedFile) {
    return state
  }
  if (!compareSourceUri || compareSourceUri === focusedFile.path) {
    return state
  }
  await OpenDiff.openDiff(compareSourceUri, focusedFile.path, true, applicationId)
  return {
    ...state,
    compareSourceUri: '',
  }
}
