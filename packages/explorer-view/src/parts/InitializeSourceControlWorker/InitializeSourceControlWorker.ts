import { IconThemeWorker } from '@lvce-editor/rpc-registry'
import { createSourceControlWorkerRpc } from '../CreateSourceControlWorkerRpc/CreateSourceControlWorkerWorkerRpc.ts'

export const initializeSourceControlWorker = async (): Promise<void> => {
  const rpc = await createSourceControlWorkerRpc()
  // TODO
  IconThemeWorker.set(rpc)
}
