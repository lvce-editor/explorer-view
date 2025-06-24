import * as RendererWorker from '../RendererWorker/RendererWorker.ts'

export const setFocus = (key: number): Promise<void> => {
  return RendererWorker.invoke('Focus.setFocus', key)
}
