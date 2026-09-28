import { FileSystemWorker } from '@lvce-editor/rpc-registry'
import { createFileSystemWorkerRpc } from '../CreateFileSystemWorkerRpc/CreateFileSystemWorkerRpc.ts'

export const initializeFileSystemWorker = async (): Promise<void> => {
  const rpc = await createFileSystemWorkerRpc()
  FileSystemWorker.set(rpc)
}
