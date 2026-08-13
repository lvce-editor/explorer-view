import { ViewletCommand } from '@lvce-editor/constants'
import { RendererProcess } from '@lvce-editor/rpc-registry'
import * as ApplyRender from '../ApplyRender/ApplyRender.ts'
import * as Diff from '../Diff/Diff.ts'
import * as ExplorerStates from '../ExplorerStates/ExplorerStates.ts'

export const render2 = async (uid: number, _diffResult: readonly number[]): Promise<readonly any[]> => {
  const { oldState, scheduledState } = ExplorerStates.get(uid)
  const diffResult = Diff.diff(oldState, scheduledState)
  ExplorerStates.set(uid, scheduledState, scheduledState)
  const commands = ApplyRender.applyRender(oldState, scheduledState, diffResult)
  const rendererWorkerCommands = commands.filter((command) => command[0] === ViewletCommand.SetFocusContext)
  const rendererProcessCommands = commands.filter((command) => command[0] !== ViewletCommand.SetFocusContext)
  const transactionId = await RendererProcess.invoke('Viewlet.queueCommands', uid, rendererProcessCommands)
  return [...rendererWorkerCommands, ['Viewlet.commitPending', uid, transactionId]]
}
