import * as RendererWorker from '../RendererWorker/RendererWorker.ts'

export const sendMessagePortToFileSystemWorker = async (port: any): Promise<void> => {
  await RendererWorker.sendMessagePortToFileSystemWorker(port, 0)
}
