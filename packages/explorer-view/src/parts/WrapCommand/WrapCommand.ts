import type { Fn, WrappedFn } from '../WrappedCommand/WrappedCommand.ts'
import * as ExplorerStates from '../ExplorerStates/ExplorerStates.ts'

export const wrapCommand = (fn: Fn): WrappedFn => {
  const wrapped = async (uid: number, ...args: readonly any[]): Promise<void> => {
    const { newState } = ExplorerStates.get(uid)
    const newerState = await fn(newState, ...args)
    if (newState === newerState) {
      return
    }
    const latest = ExplorerStates.get(uid)
    ExplorerStates.set(uid, latest.oldState, newerState)
  }
  return wrapped
}
