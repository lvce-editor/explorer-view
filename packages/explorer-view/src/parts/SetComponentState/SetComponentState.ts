import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as ExplorerStates from '../ExplorerStates/ExplorerStates.ts'

const appliedInputs = new WeakMap<ExplorerState, string>()

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
  const { newState, oldState } = ExplorerStates.get(uid)
  const updatedState = applyComponentState(newState, state)
  const input = JSON.stringify(updatedState)
  // A live edit is applied before Save writes the same JSON again. Preserve
  // the derived items unless another command has changed the current state.
  if (appliedInputs.get(newState) === input) return
  if (JSON.stringify(newState.visibleExplorerItems) === JSON.stringify(updatedState.visibleExplorerItems)) {
    await setDerivedComponentState(uid, updatedState)
  } else {
    ExplorerStates.set(uid, oldState, updatedState)
  }
  appliedInputs.set(ExplorerStates.get(uid).newState, input)
}
