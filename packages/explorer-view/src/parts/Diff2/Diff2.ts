import * as Diff from '../Diff/Diff.ts'
import * as ExplorerStates from '../ExplorerStates/ExplorerStates.ts'

export const diff2 = (uid: number): readonly number[] => {
  const { oldState, newState } = ExplorerStates.get(uid)
  const result = Diff.diff(oldState, newState)
  return result
}
