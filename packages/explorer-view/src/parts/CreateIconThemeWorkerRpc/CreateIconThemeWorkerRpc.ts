import { type Rpc, TransferMessagePortRpcParent } from '@lvce-editor/rpc'
import { VError } from '@lvce-editor/verror'
import * as SendMessagePortToFileSystemWorker from '../SendMessagePortToFileSystemWorker/SendMessagePortToFileSystemWorker.ts'

export const createIconThemeWorkerRpc = async (): Promise<Rpc> => {
  try {
    const rpc = await TransferMessagePortRpcParent.create({
      commandMap: {},
      send: SendMessagePortToFileSystemWorker.sendMessagePortToFileSystemWorker,
    })
    return rpc
  } catch (error) {
    throw new VError(error, `Failed to create icon theme worker rpc`)
  }
}
