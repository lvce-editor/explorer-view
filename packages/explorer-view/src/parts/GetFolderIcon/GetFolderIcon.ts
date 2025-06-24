import * as Rpc from '../RendererWorker/RendererWorker.ts'

export const getFolderIcon = async (name: string): Promise<string> => {
  return Rpc.invoke('IconTheme.getFolderIcon', { name })
}
