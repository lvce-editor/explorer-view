import { RendererWorker } from '@lvce-editor/rpc-registry'

export const getFileHandles = async (fileIds: readonly number[]): Promise<readonly FileSystemHandle[]> => {
  if (fileIds.length === 0) {
    return []
  }
  const files = await RendererWorker.getFileHandles(fileIds)
  return files
}
