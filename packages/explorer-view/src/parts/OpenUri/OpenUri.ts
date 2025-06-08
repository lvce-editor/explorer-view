import * as ParentRpc from '../RendererWorker/RendererWorker.ts'

export const openUri = async (uri: string, focus: boolean): Promise<void> => {
  await ParentRpc.invoke(/* Main.openAbsolutePath */ 'Main.openUri', /* absolutePath */ uri, /* focus */ focus)
}
