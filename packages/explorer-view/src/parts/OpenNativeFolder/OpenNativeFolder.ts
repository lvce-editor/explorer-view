import * as ParentRpc from '../RendererWorker/RendererWorker.ts'

export const openNativeFolder = async (path: string): Promise<void> => {
  await ParentRpc.invoke('OpenNativeFolder.openNativeFolder', /* path */ path)
}
