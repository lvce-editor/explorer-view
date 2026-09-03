import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as ExplorerStates from '../ExplorerStates/ExplorerStates.ts'

const applyComponentState = (currentState: ExplorerState, state: ExplorerState): ExplorerState => {
  if (!state || typeof state !== 'object' || Array.isArray(state)) {
    throw new TypeError('Explorer state must be an object')
  }
  const { uid } = state
  if (uid !== currentState.uid) {
    throw new Error(`Explorer state uid must remain ${currentState.uid}`)
  }
  return state
}

export const setComponentState = ExplorerStates.wrapListItemCommandImmediate(applyComponentState)
