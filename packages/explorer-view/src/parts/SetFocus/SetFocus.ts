import * as ParentRpc from '../RendererWorker/RendererWorker.ts'

export const setFocus = (key: number): Promise<void> => {
  return ParentRpc.invoke('Focus.setFocus', key)
}
