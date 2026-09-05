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

const setDerivedComponentState = ExplorerStates.wrapListItemCommandImmediate(applyComponentState)

export const setComponentState = async (uid: number, state: ExplorerState): Promise<void> => {
  const { oldState, newState } = ExplorerStates.get(uid)
  const updatedState = applyComponentState(newState, state)
  if (JSON.stringify(newState.visibleExplorerItems) === JSON.stringify(updatedState.visibleExplorerItems)) {
    await setDerivedComponentState(uid, updatedState)
    return
  }
  ExplorerStates.set(uid, oldState, updatedState)
}
