import * as RendererWorker from '../RendererWorker/RendererWorker.ts'

export const openNativeFolder = async (path: string): Promise<void> => {
  await RendererWorker.invoke('OpenNativeFolder.openNativeFolder', /* path */ path)
}
