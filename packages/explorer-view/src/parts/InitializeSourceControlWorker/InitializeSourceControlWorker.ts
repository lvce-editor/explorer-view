import { SourceControlWorker } from '@lvce-editor/rpc-registry'
import { DecorationsEnabled } from '../Config/Config.ts'
import { createSourceControlWorkerRpc } from '../CreateSourceControlWorkerRpc/CreateSourceControlWorkerWorkerRpc.ts'

export const initializeSourceControlWorker = async (): Promise<void> => {
  try {
    if (!DecorationsEnabled) {
      return
    }
    const rpc = await createSourceControlWorkerRpc()
    // TODO
    SourceControlWorker.set(rpc)
  } catch {
    // ignore
  }
}
