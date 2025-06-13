import * as ParentRpc from '../RendererWorker/RendererWorker.ts'

export const getFileHandles = async (fileIds: readonly number[]): Promise<readonly FileSystemHandle[]> => {
  const files = await ParentRpc.invoke('FileSystemHandle.getFileHandles', fileIds)
  return files
}
