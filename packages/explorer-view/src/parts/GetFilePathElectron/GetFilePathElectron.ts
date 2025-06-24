import * as RendererWorker from '../RendererWorker/RendererWorker.ts'

export const getFilePathElectron = async (file: File): Promise<string> => {
  return RendererWorker.invoke('FileSystemHandle.getFilePathElectron', file)
}
