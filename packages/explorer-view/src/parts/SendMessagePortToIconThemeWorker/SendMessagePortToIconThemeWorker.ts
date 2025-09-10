import * as RendererWorker from '../RendererWorker/RendererWorker.ts'

export const sendMessagePortToIconThemeWorker = async (port: any): Promise<void> => {
  // @ts-ignore
  await RendererWorker.sendMessagePortToIconThemeWorker(port, 0)
}
