import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'

const states = Object.create(null)

export const get = (
  uid: number,
): {
  oldState: ExplorerState
  newState: ExplorerState
} => {
  return states[uid]
}

export const set = (uid: number, oldState: ExplorerState, newState: ExplorerState): void => {
  states[uid] = {
    oldState,
    newState,
  }
}
