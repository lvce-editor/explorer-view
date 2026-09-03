import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as ExplorerStates from '../ExplorerStates/ExplorerStates.ts'

export const setComponentState = (uid: number, state: ExplorerState): void => {
  if (!state || typeof state !== 'object' || Array.isArray(state)) {
    throw new TypeError('Explorer state must be an object')
  }
  const { uid: stateUid } = state
  if (stateUid !== uid) {
    throw new Error(`Explorer state uid must remain ${uid}`)
  }
  const current = ExplorerStates.get(uid)
  ExplorerStates.set(uid, current.oldState, state, state)
}
