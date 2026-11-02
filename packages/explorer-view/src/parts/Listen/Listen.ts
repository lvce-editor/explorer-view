import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as CommandMap from '../CommandMap/CommandMap.ts'
import { registerCommands } from '../ExplorerStates/ExplorerStates.ts'
import { initializeCacheWorker } from '../InitializeCacheWorker/InitializeCacheWorker.ts'
import { initializeDragAndDropWorker } from '../InitializeDragAndDropWorker/InitializeDragAndDropWorker.ts'
import { initializeIconThemeWorker } from '../InitializeIconThemeWorker/InitializeIconThemeWorker.ts'
import { initializeSourceControlWorker } from '../InitializeSourceControlWorker/InitializeSourceControlWorker.ts'

export const listen = async (): Promise<void> => {
  registerCommands(CommandMap.commandMap)
  await Promise.all([
    RendererWorker.initializeRendererWorkerForWorker(CommandMap.commandMap),
    RendererWorker.initializeFileSystemWorker(),
    initializeIconThemeWorker(),
    initializeSourceControlWorker(),
    initializeDragAndDropWorker(),
    initializeCacheWorker(),
  ])
  await RendererWorker.initializeDialogWorker()
}
