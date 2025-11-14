import { RendererWorker } from '@lvce-editor/rpc-registry'

export const sendMessagePortToIconThemeWorker = async (port: any): Promise<void> => {
  // @ts-ignore
  await RendererWorker.sendMessagePortToIconThemeWorker(port, 0)
}
