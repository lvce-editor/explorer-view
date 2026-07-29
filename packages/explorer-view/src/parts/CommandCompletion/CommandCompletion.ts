import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'

const commandCompletions = new WeakMap<ExplorerState, Promise<void>>()

export const set = (state: ExplorerState, completion: Promise<void>): ExplorerState => {
  commandCompletions.set(state, completion)
  return state
}

export const take = (state: ExplorerState): Promise<void> | undefined => {
  const completion = commandCompletions.get(state)
  commandCompletions.delete(state)
  return completion
}
