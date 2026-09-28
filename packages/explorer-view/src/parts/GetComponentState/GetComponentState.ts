import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as ExplorerStates from '../ExplorerStates/ExplorerStates.ts'

export const getComponentState = (uid: number): ExplorerState => {
  return ExplorerStates.get(uid).newState
}
