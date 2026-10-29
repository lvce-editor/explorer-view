import { LazyTransferMessagePortRpcParent } from '@lvce-editor/rpc'
import { DialogWorker, RendererWorker } from '@lvce-editor/rpc-registry'
import * as CommandMap from '../CommandMap/CommandMap.ts'
import { registerCommands } from '../ExplorerStates/ExplorerStates.ts'
import { initializeCacheWorker } from '../InitializeCacheWorker/InitializeCacheWorker.ts'
import { initializeDragAndDropWorker } from '../InitializeDragAndDropWorker/InitializeDragAndDropWorker.ts'
import { initializeFileSystemWorker } from '../InitializeFileSystemWorker/InitializeFileSystemWorker.ts'
import { initializeIconThemeWorker } from '../InitializeIconThemeWorker/InitializeIconThemeWorker.ts'
import { initializeSourceControlWorker } from '../InitializeSourceControlWorker/InitializeSourceControlWorker.ts'

export const listen = async (): Promise<void> => {
  registerCommands(CommandMap.commandMap)
  await Promise.all([
    RendererWorker.initializeRendererWorkerForWorker(CommandMap.commandMap),
    initializeFileSystemWorker(),
    initializeIconThemeWorker(),
    initializeSourceControlWorker(),
    initializeDragAndDropWorker(),
    initializeCacheWorker(),
  ])
  const dialogRpc = await LazyTransferMessagePortRpcParent.create({
    commandMap: {},
    send: RendererWorker.sendMessagePortToDialogWorker,
  })
  DialogWorker.set(dialogRpc)
}
