import { WebWorkerRpcClient } from '@lvce-editor/rpc'
import * as CommandMap from '../CommandMap/CommandMap.ts'
import { registerCommands } from '../ExplorerStates/ExplorerStates.ts'
import * as RendererWorker from '../RendererWorker/RendererWorker.ts'

export const listen = async (): Promise<void> => {
  registerCommands(CommandMap.commandMap)
  const rpc = await WebWorkerRpcClient.create({
    commandMap: CommandMap.commandMap,
  })
  RendererWorker.set(rpc)
}
