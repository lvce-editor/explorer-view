import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'

const commandCompletion = Symbol('commandCompletion')

interface StateWithCommandCompletion extends ExplorerState {
  readonly [commandCompletion]: Promise<void>
}

export const get = (state: ExplorerState): Promise<void> | undefined => {
  return (state as StateWithCommandCompletion)[commandCompletion]
}

export const set = (state: ExplorerState, completion: Promise<void>): ExplorerState => {
  Object.defineProperty(state, commandCompletion, {
    value: completion,
  })
  return state
}
