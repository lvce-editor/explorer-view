import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import { cancelEditInternal } from '../CancelEditInternal/CancelEditInternal.ts'
import * as InputSource from '../InputSource/InputSource.ts'

export const cancelEdit = async (state: ExplorerState): Promise<ExplorerState> => {
  const { inputSource } = state
  const newState = await cancelEditInternal(state, true)
  return {
    ...newState,
    inputSource: inputSource === InputSource.User ? InputSource.Script : inputSource,
  }
}
