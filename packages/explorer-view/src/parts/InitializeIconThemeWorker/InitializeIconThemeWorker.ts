import { createIconThemeWorkerRpc } from '../CreateIconThemeWorkerRpc/CreateIconThemeWorkerRpc.ts'
import * as IconThemeWorker from '../IconThemeWorker/IconThemeWorker.ts'

export const initializeIconThemeWorker = async (): Promise<void> => {
  const rpc = await createIconThemeWorkerRpc()
  IconThemeWorker.set(rpc)
}
