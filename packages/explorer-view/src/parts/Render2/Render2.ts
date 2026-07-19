import * as ApplyRender from '../ApplyRender/ApplyRender.ts'
import * as Diff from '../Diff/Diff.ts'
import * as ExplorerStates from '../ExplorerStates/ExplorerStates.ts'

export const render2 = (uid: number, _diffResult: readonly number[]): readonly any[] => {
  const { oldState, scheduledState } = ExplorerStates.get(uid)
  const diffResult = Diff.diff(oldState, scheduledState)
  ExplorerStates.set(uid, scheduledState, scheduledState)
  const commands = ApplyRender.applyRender(oldState, scheduledState, diffResult)
  return commands
}
