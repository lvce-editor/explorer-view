import { RendererWorker } from '@lvce-editor/rpc-registry'

export const openFolder = async (): Promise<void> => {
  // @ts-ignore
  await RendererWorker.invoke(`Dialog.openFolder`)
}
