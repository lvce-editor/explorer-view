import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import { cancelEditInternal } from '../CancelEditInternal/CancelEditInternal.ts'

export const cancelEdit = (state: ExplorerState): ExplorerState => {
  return cancelEditInternal(state, true)
}
