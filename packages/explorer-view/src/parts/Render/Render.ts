import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as ApplyRender from '../ApplyRender/ApplyRender.ts'
import * as Diff from '../Diff/Diff.ts'
import * as ExplorerStates from '../ExplorerStates/ExplorerStates.ts'

export const renderInternal = (oldState: ExplorerState, newState: ExplorerState): any => {
  const diffResult = Diff.diff(oldState, newState)
  return ApplyRender.applyRender(oldState, newState, diffResult)
}

export const doRender = (uid: number, _: any): any => {
  if (typeof uid === 'number') {
    const { oldState, newState } = ExplorerStates.get(uid)
    const commands = renderInternal(oldState, newState)
    return commands
  }
  // deprecated
  const oldState = uid
  const newState = _
  const commands = renderInternal(oldState, newState)
  return commands
}
