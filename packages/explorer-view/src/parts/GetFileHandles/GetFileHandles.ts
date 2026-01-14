import { RendererWorker } from '@lvce-editor/rpc-registry'

export const getFileHandles = async (fileIds: readonly number[]): Promise<readonly FileSystemHandle[]> => {
  const files = await RendererWorker.getFileHandles(fileIds)
  return files
}
