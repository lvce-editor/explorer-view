import * as ParentRpc from '../RendererWorker/RendererWorker.ts'

export const getFilePathElectron = async (file: File): Promise<string> => {
  return ParentRpc.invoke('FileSystemHandle.getFilePathElectron', file)
}
